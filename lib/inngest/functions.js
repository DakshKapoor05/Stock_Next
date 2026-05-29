import { inngest } from "@/lib/inngest/client";
import {
  NEWS_SUMMARY_EMAIL_PROMPT,
  PERSONALIZED_WELCOME_EMAIL_PROMPT,
} from "@/lib/inngest/prompts";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "@/lib/nodemailer";
import { getAllUsersForNewsEmail } from "@/lib/actions/user.actions";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import { getNews } from "@/lib/actions/finnhub.actions";
import { getFormattedTodayDate } from "@/lib/utils";
import crypto from "crypto";
import sanitizeHtml from "sanitize-html";

export const sendSignUpEmail = inngest.createFunction(
  {
    id: "sign-up-email",
    triggers: [{ event: "app/user.created" }],
  },
  async ({ event, step }) => {
    const userProfile = `
- Country: ${event.data.country}
- Investment goals: ${event.data.investmentGoals}
- Risk tolerance: ${event.data.riskTolerance}
- Preferred industry: ${event.data.preferredIndustry}
`;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      "{{userProfile}}",
      userProfile,
    );

    const response = await step.ai.infer("generate-welcome-intro", {
      model: step.ai.models.gemini({
        model: "gemini-2.5-flash-lite",
      }),
      body: {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    await step.run("send-welcome-email", async () => {
      const part = response.candidates?.[0]?.content?.parts?.[0];

      const introText =
        (part && "text" in part ? part.text : null) ||
        "Thanks for joining Signalist. You now have the tools to track markets and make smarter moves.";

      const {
        data: { email, name },
      } = event;

      return sendWelcomeEmail({
        email,
        name,
        intro: introText,
      });
    });

    return {
      success: true,
      message: "Welcome email sent successfully",
    };
  },
);

export const sendDailyNewsSummary = inngest.createFunction(
  {
    id: "daily-news-summary",
    triggers: [{ event: "app/send.daily.news" }, { cron: "0 12 * * *" }],
  },
  async ({ step }) => {
    // Step 1: Get all users
    const users = await step.run("get-all-users", getAllUsersForNewsEmail);

    if (!users?.length) {
      return {
        success: false,
        message: "No users found for news email",
      };
    }

    // Step 2: Fetch news for each user
    const results = await step.run("fetch-user-news", async () => {
      const perUser = [];

      for (const user of users) {
        try {
          const symbols = await getWatchlistSymbolsByEmail(user.email);

          let articles = await getNews(symbols);

          articles = (articles || []).slice(0, 6);

          if (!articles.length) {
            articles = await getNews();
            articles = (articles || []).slice(0, 6);
          }

          perUser.push({
            user,
            articles,
          });
        } catch (error) {
          const hashedEmail = crypto
            .createHash("sha256")
            .update(user.email)
            .digest("hex")
            .substring(0, 16);
          console.error(
            "daily-news: error preparing user news",
            hashedEmail,
            error,
          );

          perUser.push({
            user,
            articles: [],
          });
        }
      }

      return perUser;
    });

    // Step 3: Generate summaries
    const userNewsSummaries = [];

    for (const { user, articles } of results) {
      try {
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
          "{{newsData}}",
          JSON.stringify(articles, null, 2),
        );

        const hashedEmail = crypto
          .createHash("sha256")
          .update(user.email)
          .digest("hex")
          .substring(0, 16);

        const response = await step.ai.infer(`summarize-news-${hashedEmail}`, {
          model: step.ai.models.gemini({
            model: "gemini-2.5-flash-lite",
          }),
          body: {
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
          },
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];

        const newsContent =
          (part && "text" in part ? part.text : null) || "No market news.";

        // Sanitize HTML first with strict allowlist
        const cleanedHtml = sanitizeHtml(newsContent, {
          allowedTags: [
            "p",
            "br",
            "strong",
            "em",
            "u",
            "h1",
            "h2",
            "h3",
            "h4",
            "ul",
            "ol",
            "li",
            "a",
            "img",
          ],
          allowedAttributes: {
            a: ["href", "target"],
            img: ["src", "alt"],
          },
          allowedSchemes: ["http", "https"],
        });

        // Make AI-generated images responsive
        const sanitizedNewsContent = cleanedHtml.replace(
          /<img([^>]*)>/gi,
          (match, attrs) => {
            const cleanAttrs = attrs.replace(/style="[^"]*"/gi, "");

            return `<img${cleanAttrs}
          style="width:100%;max-width:520px;height:auto;display:block;border-radius:8px;margin:12px 0;"
        >`;
          },
        );

        userNewsSummaries.push({
          user,
          newsContent: sanitizedNewsContent,
        });
      } catch (error) {
        const hashedEmail = crypto
          .createHash("sha256")
          .update(user.email)
          .digest("hex")
          .substring(0, 16);
        console.error("Failed to summarize news for:", hashedEmail, error);

        userNewsSummaries.push({
          user,
          newsContent: null,
        });
      }
    }

    // Step 4: Send emails
    await step.run("send-news-emails", async () => {
      const results = await Promise.allSettled(
        userNewsSummaries.map(({ user, newsContent }) => {
          if (!newsContent) return Promise.resolve(false);

          return sendNewsSummaryEmail({
            email: user.email,
            date: getFormattedTodayDate(),
            newsContent,
          });
        }),
      );

      const failures = results.filter((r) => r.status === "rejected");
      if (failures.length > 0) {
        failures.forEach((failure, index) => {
          const user = userNewsSummaries[index]?.user;
          if (user) {
            const hashedEmail = crypto
              .createHash("sha256")
              .update(user.email)
              .digest("hex")
              .substring(0, 16);
            console.error(
              "Failed to send email to:",
              hashedEmail,
              failure.reason,
            );
          }
        });
      }

      return {
        total: results.length,
        succeeded: results.filter((r) => r.status === "fulfilled").length,
        failed: failures.length,
      };
    });

    return {
      success: true,
      message: "Daily news summary emails sent successfully",
    };
  },
);
