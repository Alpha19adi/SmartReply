"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EmailVerificationPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/signin");
    }, 5000); 

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
        <p className="mt-2 text-gray-600">
          We’ve sent a verification link to your email. Please check your inbox and follow the instructions to activate your account.
        </p>
        <button
          onClick={() => router.push("/signin")}
          className="mt-6 w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
}
