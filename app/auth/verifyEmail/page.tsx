"use client";

import { useEffect } from "react";
import { verifyEmail } from "@/lib/apiAuth";

export default function EmailVerifiedPage() {
  useEffect(() => {
    async function verify() {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      if (!token) {
        alert("Invalid verification link.");
        return;
      }

      try {
        await verifyEmail(token);
      } catch (error) {
        console.error("Email verification failed:", error);
        alert("Email verification failed. Please try again.");
      }
    }
    verify();
  }, []);

  return (
    <div className="page flex items-center justify-center min-h-screen">
      <div className="card w-full max-w-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-700">
          Email Verified!
        </h1>
        <p className="mb-6 text-slate-700">
          Your email address has been successfully verified.
          <br />
          You can now log in and start using your account.
        </p>
        <a href="/auth/login" className="btn btn-primary w-full">
          Go to Login
        </a>
      </div>
    </div>
  );
}
