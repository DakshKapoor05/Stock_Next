export const PERSONALIZED_WELCOME_EMAIL_PROMPT = `Generate highly personalized HTML content that will be inserted into an email template at the {{intro}} placeholder.

User profile data:
{{userProfile}}

PERSONALIZATION REQUIREMENTS:
You MUST create content that is obviously tailored to THIS specific user by:

IMPORTANT: Do NOT start the personalized content with "Welcome" since the email header already says "Welcome aboard {{name}}". Use alternative openings like "Thanks for joining", "Great to have you", "You're all set", "Perfect timing", etc.

1. **Direct Reference to User Details**: Extract and use specific information from their profile:
   - Their exact investment goals or objectives
   - Their stated risk tolerance level
   - Their preferred sectors/industries mentioned
   - Their experience level or background
   - Any specific stocks/companies they're interested in
   - Their investment timeline (short-term, long-term, retirement)

2. **Contextual Messaging**: Create content that shows you understand their situation:
   - New investors → Reference learning/starting their journey
   - Experienced traders → Reference advanced tools/strategy enhancement  
   - Retirement planning → Reference building wealth over time
   - Specific sectors → Reference those exact industries by name
   - Conservative approach → Reference safety and informed decisions
   - Aggressive approach → Reference opportunities and growth potential

3. **Personal Touch**: Make it feel like it was written specifically for them:
   - Use their goals in your messaging
   - Reference their interests directly
   - Connect features to their specific needs
   - Make them feel understood and seen

CRITICAL FORMATTING REQUIREMENTS:
- Return ONLY clean HTML content with NO markdown, NO code blocks, NO backticks
- Use SINGLE paragraph only: <p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">content</p>
- Write exactly TWO sentences (add one more sentence than current single sentence)
- Keep total content between 35-50 words for readability
- Use <strong> for key personalized elements (their goals, sectors, etc.)
- DO NOT include "Here's what you can do right now:" as this is already in the template
- Make every word count toward personalization
- Second sentence should add helpful context or reinforce the personalization

Example personalized outputs (showing obvious customization with TWO sentences):
<p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">Thanks for joining Signalist! As someone focused on <strong>technology growth stocks</strong>, you'll love our real-time alerts for companies like the ones you're tracking. We'll help you spot opportunities before they become mainstream news.</p>

<p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">Great to have you aboard! Perfect for your <strong>conservative retirement strategy</strong> — we'll help you monitor dividend stocks without overwhelming you with noise. You can finally track your portfolio progress with confidence and clarity.</p>

<p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">You're all set! Since you're new to investing, we've designed simple tools to help you build confidence while learning the <strong>healthcare sector</strong> you're interested in. Our beginner-friendly alerts will guide you without the confusing jargon.</p>`;

export const NEWS_SUMMARY_EMAIL_PROMPT = `
Generate HTML content for a market news summary email that will be inserted into the NEWS_SUMMARY_EMAIL_TEMPLATE at the {{newsContent}} placeholder.

News data to summarize:
{{newsData}}

CRITICAL FORMATTING REQUIREMENTS:

- Return ONLY valid HTML.
- Do NOT return markdown.
- Do NOT use \`\`\` code blocks.
- Do NOT include <html>, <head>, <body>, or <style> tags.
- Output only the HTML that will replace {{newsContent}}.
- Use inline styles only.
- Keep the content email-friendly and fully responsive.
- Use professional formatting suitable for a financial newsletter.
- Ensure all content renders correctly in Gmail, Outlook, Apple Mail, and mobile email clients.

IMAGE REQUIREMENTS:

- Include article images when available.
- All images must be responsive.
- Do NOT use width attributes.
- Do NOT use height attributes.
- Do NOT use fixed pixel dimensions.
- Never generate images wider than the email container.
- Never use styles that override width:100%.

Wrap every image in:

<div style="margin:16px 0;overflow:hidden;border-radius:8px;">
  IMAGE_HERE
</div>

Every image MUST use:

<img
  src="IMAGE_URL"
  alt="ARTICLE_IMAGE"
  style="width:100%;max-width:520px;height:auto;display:block;border-radius:8px;"
/>

- If an image URL is unavailable, omit the image completely.
- Never generate broken image tags.

CONTENT REQUIREMENTS:

- Start with a short market overview paragraph summarizing today's key market developments.
- Include up to 6 articles.
- Create a separate section for each article.
- Include the article headline.
- Include a concise summary (2–3 sentences).
- Include source name if available.
- Include publication date if available.
- Include article image when available.
- Include a "Read More" link pointing to the original article URL.
- Keep summaries concise and easy to scan.
- Prioritize the most relevant market-moving news.

HEADINGS:

Use exactly:

<h3 style="margin:0 0 10px 0;font-size:18px;font-weight:600;color:#FDD458;line-height:1.3;">
  ARTICLE_HEADLINE
</h3>

PARAGRAPHS:

Use exactly:

<p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#CCDADC;">
  ARTICLE_SUMMARY
</p>

ARTICLE CONTAINERS:

Wrap each article in:

<div style="margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid #30333A;width:100%;max-width:520px;">
  ARTICLE_CONTENT
</div>

SOURCE / DATE:

Use:

<p style="margin:0 0 12px 0;font-size:12px;line-height:1.4;color:#9CA3AF;">
  SOURCE_NAME • PUBLICATION_DATE
</p>

LINKS:

Use exactly:

<a
  href="ARTICLE_URL"
  style="color:#FDD458;text-decoration:none;font-weight:600;"
>
  Read More →
</a>

IMPORTANT:

- All generated HTML must fit inside a 520px-wide email content area.
- Never generate content that can overflow horizontally.
- All images, links, and containers must remain responsive.
- Avoid long unbroken strings of text.
- Do not include JavaScript.
- Do not include forms.
- Do not include embedded media.
- Do not include iframes.
- Do not include external CSS classes.
- Use only inline styles.
- Match Signalist's dark theme aesthetic.

The generated HTML should look professional, modern, mobile-friendly, and visually consistent with Signalist's branding.
`;

export const TRADINGVIEW_SYMBOL_MAPPING_PROMPT = `You are an expert in financial markets and trading platforms. Your task is to find the correct TradingView symbol that corresponds to a given Finnhub stock symbol.

Stock information from Finnhub:
Symbol: {{symbol}}
Company: {{company}}
Exchange: {{exchange}}
Currency: {{currency}}
Country: {{country}}

IMPORTANT RULES:
1. TradingView uses specific symbol formats that may differ from Finnhub
2. For US stocks: Usually just the symbol (e.g., AAPL for Apple)
3. For international stocks: Often includes exchange prefix (e.g., NASDAQ:AAPL, NYSE:MSFT, LSE:BARC)
4. Some symbols may have suffixes for different share classes
5. ADRs and foreign stocks may have different symbol formats

RESPONSE FORMAT:
Return ONLY a valid JSON object with this exact structure:
{
  "tradingViewSymbol": "EXCHANGE:SYMBOL",
  "confidence": "high|medium|low",
  "reasoning": "Brief explanation of why this mapping is correct"
}

EXAMPLES:
- Apple Inc. (AAPL) from Finnhub → {"tradingViewSymbol": "NASDAQ:AAPL", "confidence": "high", "reasoning": "Apple trades on NASDAQ as AAPL"}
- Microsoft Corp (MSFT) from Finnhub → {"tradingViewSymbol": "NASDAQ:MSFT", "confidence": "high", "reasoning": "Microsoft trades on NASDAQ as MSFT"}
- Barclays PLC (BARC.L) from Finnhub → {"tradingViewSymbol": "LSE:BARC", "confidence": "high", "reasoning": "Barclays trades on London Stock Exchange as BARC"}

Your response must be valid JSON only. Do not include any other text.`;
