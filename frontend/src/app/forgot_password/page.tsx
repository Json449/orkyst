"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    form: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
    // Clear error when user types
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submission
    if (!email) {
      setErrors({ email: "Email is required", form: "" });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email", form: "" });
      return;
    }

    setIsLoading(true);
    setErrors({ email: "", form: "" });

    try {
      const response = await fetch("/api/forgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { data } = await response.json();
      if (response.ok) {
        router.push(`/account_verification`);
      } else {
        setErrors((prev) => ({
          ...prev,
          form: data.message || "Failed to send code",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        form: error,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-10 flex h-screen bg-[#ffffff] justify-center items-center">
      {/* Left Banner (hidden on mobile) */}
      <div className="lg:min-w-[60%] relative lg:block hidden justify-center items-center w-full">
        <Image
          src="/images/loginbanner.svg"
          alt="Login Banner"
          layout="responsive"
          width={502}
          height={350}
          objectFit="cover"
          objectPosition="center"
          priority
        />
        <div className="mt-[-60px] flex justify-center">
          <div className="text-left max-w-3xl">
            <p className="font-inter text-[#080a0b] text-[42px] font-bold">
              Transform Marketing <span className="text-primary">Chaos</span>
              <br />
              into
              <span className="ml-3 font-inter text-primary text-[42px] font-bold">
                Results
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="lg:min-w-[40%] min-w-[100%] lg:flex justify-start items-center">
        <div className="flex flex-col items-center lg:justify-start justify-center bg-white h-[100vh] lg:h-auto lg:min-w-[560px]">
          <Image
            src="/logo.svg"
            alt="Company Logo"
            width={228}
            height={76}
            priority
          />

          <div className="w-full mt-8 border border-2 p-[50px] rounded-xl border-primary">
            <h1 className="text-center text-[#080a0b] text-[32px] font-bold leading-8 mb-8">
              {` Forgot Password`}
            </h1>

            <p className="text-[#5A5A5A] text-sm text-center mb-6">
              {`Enter your email address and we'll send you a link to reset your
              password`}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mt-5">
                <label className="mb-2 block text-[#5A5A5A] text-sm font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={handleInputChange}
                  className={`w-full h-[52px] px-4 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-inter leading-normal outline-none transition-all duration-200 focus:ring-2 ${
                    errors.email ? "focus:ring-red-500" : "focus:ring-[#7a0860]"
                  } focus:bg-[#F8F7F7] placeholder-[#8D8D8D]`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`text-base rounded-xl w-full p-3.5 font-medium mt-6 ${
                  isLoading ? "bg-primary/80" : "bg-primary"
                } text-white hover:bg-primary-dark transition-colors`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Code"
                )}
              </button>
              {errors.form && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-center">
                  {errors.form}
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <Link href="/login">
                <span className="text-[#5CA0C2] hover:underline cursor-pointer text-sm">
                  Back to Sign In
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
