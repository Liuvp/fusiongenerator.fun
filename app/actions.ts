"use server";

import { encodedRedirect } from "@/utils/utils";
import { getCreemApiUrl } from "@/utils/creem/api-url";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

function getAuthRedirectParams(redirectTo?: string) {
  return redirectTo ? { redirect_to: redirectTo } : {};
}

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const redirectTo = formData.get("redirect_to")?.toString();
  const source = formData.get("source")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
      getAuthRedirectParams(redirectTo),
    );
  }

  let emailRedirectTo = `${origin}/auth/callback`;
  if (redirectTo) {
    emailRedirectTo += `?redirect_to=${encodeURIComponent(redirectTo)}`;
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    let errorMessage = error.message;
    if (error.message.toLowerCase().includes("already registered")) {
      errorMessage =
        "This email already has an account. Sign in instead, or continue with Google if you used Google before.";
      return encodedRedirect(
        "error",
        "/sign-up",
        errorMessage,
        { ...getAuthRedirectParams(redirectTo), email, existing: "true" },
      );
    }
    return encodedRedirect(
      "error",
      "/sign-up",
      errorMessage,
      getAuthRedirectParams(redirectTo),
    );
  }

  // Auto sign-in after successful registration (email confirmation disabled)
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    // Fallback to sign-in page if auto-login fails
    return encodedRedirect(
      "success",
      "/sign-in",
      "Account created! You can now sign in.",
      { redirect_to: redirectTo, source },
    );
  }

  // Redirect directly to studio after successful registration + auto-login
  const destination = redirectTo || "/dragon-ball";
  redirect(destination);
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirect_to")?.toString();
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let errorMessage = error.message;
    if (error.message.includes("Invalid login credentials")) {
      errorMessage =
        "Email or password is incorrect. If this email was created with Google, use Continue with Google instead.";
    }
    console.error("Sign in error:", error.message);
    return encodedRedirect(
      "error",
      "/sign-in",
      errorMessage,
      getAuthRedirectParams(redirectTo),
    );
  }

  if (redirectTo) {
    return redirect(redirectTo);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/dashboard/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  return encodedRedirect("success", "/dashboard/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

// Google OAuth不分登录/注册 — 同一函数处理两种场景
export const signInWithGoogleAction = async (formData: FormData) => {
  const redirectTo = formData?.get("redirect_to")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  let callbackUrl = `${origin}/auth/callback`;
  if (redirectTo) {
    callbackUrl += `?redirect_to=${encodeURIComponent(redirectTo)}`;
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/sign-in",
      error.message,
      getAuthRedirectParams(redirectTo),
    );
  }

  if (data.url) {
    return redirect(data.url);
  }
};

// Alias — Google OAuth is the same for sign-in and sign-up
export const signUpWithGoogleAction = signInWithGoogleAction;

export async function createCheckoutSession(
  productId: string,
  email: string,
  userId: string,
  productType: "subscription" | "credits",
  credits_amount?: number,
  discountCode?: string,
) {
  try {
    const requestBody: any = {
      product_id: productId,
      // request_id: `${userId}-${Date.now()}`, // use Unique request ID if you need
      customer: {
        email,
      },
      metadata: {
        user_id: userId,
        product_type: productType,
        credits: credits_amount || 0,
      },
    };

    if (process.env.CREEM_SUCCESS_URL) {
      requestBody.success_url = process.env.CREEM_SUCCESS_URL;
    }

    if (discountCode) {
      requestBody.discount_code = discountCode;
    }

    const response = await fetch(getCreemApiUrl("/checkouts"), {
      method: "POST",
      headers: {
        "x-api-key": process.env.CREEM_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    const data = await response.json();
    return data.checkout_url;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

// ============================================================================
// Inline-safe actions — return results instead of redirect()
// Used by fusion-studio inline auth dialog to avoid page navigation
// ============================================================================

type InlineActionResult = { redirect?: string; error?: string; success?: string };

export const inlineSignUpAction = async (formData: FormData): Promise<InlineActionResult> => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const redirectTo = formData.get("redirect_to")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  let emailRedirectTo = `${origin}/auth/callback`;
  if (redirectTo) {
    emailRedirectTo += `?redirect_to=${encodeURIComponent(redirectTo)}`;
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "This email already has an account. Sign in instead, or continue with Google." };
    }
    return { error: error.message };
  }

  // Auto sign-in after successful registration (email confirmation disabled)
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    // Fallback: user created but auto-login failed, ask them to sign in manually
    return { success: "Account created! You can now sign in." };
  }

  // Return redirect target — client will navigate to studio
  return { redirect: redirectTo || "/dragon-ball" };
};

export const inlineSignInAction = async (formData: FormData): Promise<InlineActionResult> => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const redirectTo = formData.get("redirect_to")?.toString();
  const supabase = await createClient();

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Email or password is incorrect. If this email was created with Google, use Continue with Google instead." };
    }
    return { error: error.message };
  }

  // Return redirect target — client will navigate
  return { redirect: redirectTo || "/dragon-ball" };
};
