"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function VerificationContent() {
  const router = useRouter();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus the first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Check if all digits are filled
    const isComplete = digits.every((digit) => digit !== "");
    if (isComplete) {
      handleVerifyEmail();
    }
  }, [digits]);

  const handleChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newDigits = [...digits];
      newDigits[index] = value;
      setDigits(newDigits);

      // Move to next input if a digit was entered and there's space
      if (value && index < 5) {
        setActiveIndex(index + 1);
        setTimeout(() => inputRefs.current[index + 1]?.focus(), 10);
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      setActiveIndex(index - 1);
      setTimeout(() => inputRefs.current[index - 1]?.focus(), 10);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newDigits = [...digits];
      for (let i = 0; i < pasteData.length && i < 6; i++) {
        newDigits[i] = pasteData[i];
      }
      setDigits(newDigits);
      const lastFilledIndex = Math.min(pasteData.length - 1, 5);
      setActiveIndex(lastFilledIndex);
      setTimeout(() => inputRefs.current[lastFilledIndex]?.focus(), 10);
    }
  };

  const handleVerifyEmail = async () => {
    const verificationCode = digits.join("");
    const url = "/api/verifyemail";
    setIsLoading(true);
    setError(null);

    const body = {
      code: verificationCode,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const { data } = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Verification failed");
      }
      if (data.verifiedUser) {
        router.replace(`/reset_password`);
      } else {
        router.replace(`/onboarding`);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      // Reset all digits on error
      setDigits(["", "", "", "", "", ""]);
      setActiveIndex(0);
      setTimeout(() => inputRefs.current[0]?.focus(), 10);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center bg-white h-[100vh]">
      <Image
        src="/logo.svg"
        alt="Login Banner"
        width={228}
        height={76}
        priority
      />
      <div className="w-[600px] mt-[60px]">
        <p className="text-[#080a0b] text-center text-[36px] font-bold leading-8 mb-6">
          {isLoading ? "Verifying your code..." : "Check your email for a code"}
        </p>

        {isLoading ? (
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <p className="font-inter text-center text-[#080a0b] text-base font-medium leading-6 mb-6">
              {` We've sent a 6-digit character code to your email address. The
              code expires shortly, so please enter it soon.`}
            </p>

            <div className="flex justify-between mb-6">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-16 h-16 text-[black] text-center text-2xl font-bold border rounded-lg bg-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    activeIndex === index
                      ? "border-primary"
                      : "border-[#D9D9D9]"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  autoFocus={index === activeIndex}
                  disabled={isLoading}
                />
              ))}
            </div>

            <p className="font-inter text-center text-[#080a0b] text-base font-medium leading-6 mb-6">
              {" Can't find your code? Check your spam folder."}
            </p>
          </>
        )}
        <div className="mt-6 text-center">
          <Link href="/login">
            <span className="text-[#5CA0C2] hover:underline cursor-pointer text-sm">
              Back to Sign In
            </span>
          </Link>
        </div>
        {error && (
          <p className="text-sm text-red-600 mb-4 text-center animate-shake">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AccountVerification() {
  return (
    <React.Suspense
      fallback={
        <div className="flex w-full h-screen items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <VerificationContent />
    </React.Suspense>
  );
}
