"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SetNewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    form: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({
      password: "",
      confirmPassword: "",
      form: "",
    });

    // Validate
    let isValid = true;
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      isValid = false;
    } else if (!validatePassword(password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number",
      }));
      isValid = false;
    }

    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/reset_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const { data } = await response.json();
      if (response.ok) {
        setPasswordResetSuccess(true);
        console.log("check now", data);
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

  const PasswordResetSuccessContent = () => {
    return (
      <div className="text-center">
        <h2 className="mt-10 text-3xl font-bold text-gray-900 mb-4">
          Password Reset Successful!
        </h2>
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-center">
          Your password has been successfully updated. You can now sign in with
          your new password.
        </div>
        <Link
          href="/login"
          className="mt-10 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark transition-colors"
        >
          Back to Sign In
        </Link>
      </div>
    );
  };

  return (
    <div className="pb-10 flex h-screen bg-white justify-center items-center">
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
          {passwordResetSuccess ? (
            <PasswordResetSuccessContent />
          ) : (
            <div className="w-full mt-8 border-2 border-primary p-[50px] rounded-xl">
              <h1 className="text-center text-[#080a0b] text-[32px] font-bold leading-8 mb-8">
                Set New Password
              </h1>

              <p className="text-[#5A5A5A] text-sm text-center mb-6">
                Create a new password for your account
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="mb-2 block text-[#5A5A5A] text-sm font-medium">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className={`w-full h-[52px] px-4 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-inter leading-normal outline-none transition-all duration-200 focus:ring-2 ${
                      errors.password
                        ? "focus:ring-red-500"
                        : "focus:ring-[#7a0860]"
                    } focus:bg-[#F8F7F7] placeholder-[#8D8D8D]`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="mb-5">
                  <label className="mb-2 block text-[#5A5A5A] text-sm font-medium">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className={`w-full h-[52px] px-4 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-inter leading-normal outline-none transition-all duration-200 focus:ring-2 ${
                      errors.confirmPassword
                        ? "focus:ring-red-500"
                        : "focus:ring-[#7a0860]"
                    } focus:bg-[#F8F7F7] placeholder-[#8D8D8D]`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
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
                      Resetting...
                    </span>
                  ) : (
                    "Reset Password"
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
          )}
        </div>
      </div>
    </div>
  );
}
