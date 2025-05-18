"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginState, setLoginState] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    form: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  // Validate email format
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate password (6-15 chars)
  const validatePassword = (password: string) => {
    return password.length >= 6 && password.length <= 15;
  };

  // Real-time field validation
  useEffect(() => {
    if (touched.email) {
      setErrors((prev) => ({
        ...prev,
        email: !loginState.email
          ? "Email is required"
          : !validateEmail(loginState.email)
          ? "Please enter a valid email"
          : "",
      }));
    }

    if (touched.password) {
      setErrors((prev) => ({
        ...prev,
        password: !loginState.password
          ? "Password is required"
          : !validatePassword(loginState.password)
          ? "Password must be 6-15 characters"
          : "",
      }));
    }
  }, [loginState, touched]);

  const handleSubmit = async (isAutoLogin = false) => {
    // Validate all fields before submission
    const isEmailValid = validateEmail(loginState.email);
    const isPasswordValid = validatePassword(loginState.password);

    if (!isEmailValid || !isPasswordValid) {
      setErrors({
        email: !isEmailValid ? "Please enter a valid email" : "",
        password: !isPasswordValid ? "Password must be 6-15 characters" : "",
        form: "",
      });
      setTouched({ email: true, password: true });
      return;
    }

    setIsLoading(true);
    try {
      await login.mutateAsync(
        { email: loginState.email, password: loginState.password },
        {
          onSuccess: () => {
            setErrors({ email: "", password: "", form: "" });
          },
          onError: (error: Error) => {
            console.log("erer", error);
            setErrors((prev) => ({
              ...prev,
              form: error.message || "Invalid email or password",
            }));
          },
        }
      );
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        form: error.message,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginState((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleForgotPassword = () => {
    router.push(`/forgot_password`);
  };

  return (
    <div className="flex flex-col items-center lg:justify-start justify-center bg-white h-[100vh] lg:h-auto lg:min-w-[560px]">
      <Image
        src="/logo.svg"
        alt="Login Banner"
        width={228}
        height={76}
        priority
      />
      <div className="w-full mt-8 border border-2 p-[50px] rounded-xl border-primary">
        <p className="text-[#080a0b] text-[32px] font-bold leading-8 mb-4">
          Welcome back!
        </p>
        <p className="font-inter text-[#080a0b] text-base font-medium leading-6">
          Sign into Orkyst
        </p>

        {/* Email Field */}
        <div className="mt-5">
          <label className="mb-2 block text-[#5A5A5A] text-sm font-medium">
            Email Address
          </label>
          <div className="relative w-full">
            <input
              type="email"
              name="email"
              value={loginState.email}
              placeholder="Enter your email"
              onChange={handleInputChange}
              onBlur={() => handleBlur("email")}
              className={`w-full h-[52px] px-4 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-inter leading-normal outline-none transition-all duration-200 focus:ring-2 ${
                errors.email ? "focus:ring-red-500" : "focus:ring-[#7a0860]"
              } focus:bg-[#F8F7F7] placeholder-[#8D8D8D]`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mt-5">
          <label className="mb-2 block text-[#5A5A5A] text-sm font-medium">
            Password
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password (6-15 characters)"
              value={loginState.password}
              onChange={handleInputChange}
              onBlur={() => handleBlur("password")}
              className={`w-full h-[52px] px-4 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-inter leading-normal outline-none transition-all duration-200 focus:ring-2 ${
                errors.password ? "focus:ring-red-500" : "focus:ring-[#7a0860]"
              } focus:bg-[#F8F7F7] placeholder-[#8D8D8D] pr-10`}
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#8D8D8D] hover:text-[#7a0860]"
              onClick={handleShowPassword}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <p className="text-center mt-3 font-inter text-[#080a0b] text-sm font-medium leading-5">
          <span
            onClick={handleForgotPassword}
            className="cursor-pointer hover:text-blue-500 hover:underline"
          >
            Forgot password?
          </span>
        </p>

        {/* Form Error */}
        {errors.form && (
          <div className="mt-4 text-center py-3">
            <p className="text-sm text-red-600">{errors.form}</p>
          </div>
        )}

        <div className="pt-2 relative mt-6">
          <button
            className={`text-base rounded-xl w-full p-3.5 font-medium bg-primary text-white`}
            onClick={() => handleSubmit(false)}
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
                Processing...
              </span>
            ) : (
              "Continue"
            )}
          </button>
        </div>

        <div className="relative flex items-center justify-center mt-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <p className="text-sm mx-4 text-[#94a3b8]">or</p>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          className="mt-6 flex bg-[#ECECEC] justify-center gap-3 text-base rounded-xl text-black w-full p-3.5 font-medium"
          disabled={isLoading}
        >
          Signup with Google
          <Image
            src="/images/google_logo.svg"
            alt="google"
            width={27}
            height={27}
            priority
          />
        </button>

        <Link href="/signup">
          <p className="cursor-pointer mt-6 text-sm text-center text-[#080a0b]">
            {`Don't have an account? `}
            <span className="text-[#5CA0C2]">{`Get Started`}</span>
          </p>
        </Link>
      </div>
    </div>
  );
}
