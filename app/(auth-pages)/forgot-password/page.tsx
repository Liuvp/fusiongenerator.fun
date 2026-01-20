import { Metadata } from "next";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Reset Password - Fusion Generator",
  description: "Reset your Fusion Generator account password.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ForgotPassword() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-2">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Need to reset your password? We're here to help!
        </p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Contact Support</h3>
            <p className="text-sm text-muted-foreground">
              Please send an email to our support team with your registered email address, and we'll help you reset your password.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-md bg-muted">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a
              href="mailto:support@fusiongenerator.fun?subject=Password Reset Request"
              className="text-sm font-medium text-primary hover:underline"
            >
              support@fusiongenerator.fun
            </a>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              <strong>What to include in your email:</strong>
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Your registered email address</li>
              <li>A brief description of the issue</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              We typically respond within 24 hours.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button variant="ghost" asChild>
            <Link href="/sign-in" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
