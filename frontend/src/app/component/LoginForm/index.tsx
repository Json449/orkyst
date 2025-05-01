"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/hooks/useAuth";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginState, setLoginState] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const checkPasswordLength = (pass: string) => {
    if (pass.length < 6 || pass.length > 15) {
      return true;
    }
  };

  const handleSubmit = async (isAutoLogin = false) => {
    const { email, password } = loginState;
    if (isAutoLogin || validateInput()) {
      setIsLoading(true);
      try {
        await login.mutateAsync(
          { email, password },
          {
            onSuccess: (response) => {
              console.log("Login successful", response);
            },
            onError: (error: Error) => {
              setErrors(true);
            },
          }
        );
      } catch {
        setErrors(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validateInput = () => {
    let isValid = true;
    if (
      loginState.email === "" ||
      loginState.password === "" ||
      checkPasswordLength(loginState.password)
    ) {
      setErrors(true);
      isValid = false;
    } else {
      isValid = true;
      setErrors(false);
    }
    return isValid;
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
              className="w-full h-[52px] px-4 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-inter leading-normal outline-none transition-all duration-200 focus:ring-2 focus:ring-[#7a0860] focus:bg-[#F8F7F7] placeholder-[#8D8D8D]"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-[#5A5A5A] text-sm font-medium">
            Password
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              minLength={6}
              maxLength={15}
              placeholder="Enter your password"
              value={loginState.password}
              onChange={handleInputChange}
              className="w-full h-[52px] px-4 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-inter leading-normal outline-none transition-all duration-200 focus:ring-2 focus:ring-[#7a0860] focus:bg-[#F8F7F7] placeholder-[#8D8D8D] pr-10"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#8D8D8D] hover:text-[#7a0860]"
              onClick={handleShowPassword}
            >
              {/* {showPassword ? <Icons.ShowPassword /> : <Icons.HidePassword />} */}
            </span>
          </div>
        </div>
        <p className="text-center mt-3 font-inter text-[#080a0b] text-sm font-medium leading-5">
          Forgot password?
        </p>
        <div className="pt-2 relative mt-6">
          <div
            className={`${errors ? "block" : "hidden"} text-center m-auto py-3`}
          >
            <p className="text-sm text-red-600">
              Please check your Username or Password
            </p>
          </div>
          <button
            className="text-base rounded-xl w-full p-3.5 font-medium bg-primary text-white"
            onClick={() => handleSubmit(false)}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Continue"}
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
          {"Signup with Google"}
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
