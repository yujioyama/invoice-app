"use client";

export default function EmailSentPage() {
  return (
    <div className="page flex items-center justify-center min-h-screen">
      <div className="card w-full max-w-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-slate-900">
          Verification Email Sent
        </h1>
        <p className="mb-6 text-slate-700">
          We have sent a verification link to your email address.
          <br />
          Please check your inbox and click the link to complete your
          registration.
        </p>
        <p className="text-sm text-slate-500">
          If you do not receive the email, please check your spam folder or try
          registering again.
        </p>
      </div>
    </div>
  );
}
