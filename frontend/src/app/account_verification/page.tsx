"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Move the content that uses useSearchParams to a separate component
function VerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const serializedEvent = searchParams.get("access_token");
  const accessToken = serializedEvent
    ? JSON.parse(decodeURIComponent(serializedEvent))
    : null;

  const handleVerifyEmail = async () => {
    const url = "/api/verifyemail";
    setIsLoading(true);
    setError(null);

    const body = {
      code,
      access_token: accessToken?.access_token,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Verification failed");
      }

      if (!data.success) {
        setError(data?.error || "Verification failed");
        return;
      }

      const serializedResponse = encodeURIComponent(
        JSON.stringify({
          access_token: data.data.access_token,
        })
      );

      router.replace(`/onboarding?access_token=${serializedResponse}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center bg-white h-[100vh]">
      <div className="w-[600px] p-[32px] bg-white rounded-3xl shadow-lg p-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div
            className="bg-[#7a0860] h-2.5 rounded-full"
            style={{ width: "66%" }}
          ></div>
        </div>

        <p className="text-[#080a0b] text-[24px] font-bold leading-8 mb-4">
          Account Verification
        </p>
        <p className="font-inter text-[#080a0b] text-base font-medium leading-6 mb-6">
          Please enter the verification code sent to your email to verify your
          account
        </p>
        <input
          type="number"
          name="code"
          value={code}
          placeholder="Enter verification code"
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 6) {
              setCode(value);
            }
          }}
          className="text-sm text-[#080a0b] border rounded-xl border-[#EEEEEE] h-[52px] py-3 px-4 w-full focus:outline-none"
        />
        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
        <button
          disabled={isLoading}
          className="text-base rounded-xl w-full p-3.5 font-medium bg-[#7a0860] text-white mt-6 disabled:opacity-70"
          onClick={handleVerifyEmail}
        >
          {isLoading ? "Loading..." : "Verify account"}
        </button>
      </div>
    </div>
  );
}

export default function AccountVerification() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationContent />
    </Suspense>
  );
}
