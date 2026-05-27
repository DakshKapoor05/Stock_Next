"use server";

import { auth } from "@/lib/better-auth/auth";
import { inngest } from "../inngest/client";
import { headers } from "next/headers";

export const signUpWithEmail = async ({
  email,
  password,
  fullName,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry,
}) => {
  try {
    const response = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: fullName,
      },
    });

    if (response) {
      inngest.send({
        name: "app/user.created",
        data: {
          email,
          name: fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      }).catch((err) => {
        console.error("Failed to send user.created event:", err);
      });
    }

    return { success: true, data: response };
  } catch (err) {
    console.log("Sign up failed", err);

    return {
      success: false,
      error: err?.message || "Sign up failed",
    };
  }
};

export const signOut = async () => {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (error) {
    console.log("Sign out failed", error);
    return { success: false, error: "Sign out failed" };
  }
};

export const signInWithEmail = async ({ email, password }) => {
  try {
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return { success: true, data: response };
  } catch (err) {
    console.log("Sign in failed", err);

    return {
      success: false,
      error: err?.message || "Sign in failed",
    };
  }
};
