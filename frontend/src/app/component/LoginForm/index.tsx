"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginState, setLoginState] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const checkPasswordLength = (pass: string) => {
    if (pass.length < 6 || pass.length > 15) {
      return true;
    }
  };

  const handleSubmit = async (isAutoLogin = false) => {
    const { email, password } = loginState;
    if (isAutoLogin || validateInput()) {
      const url = "/api/login";
      setIsLoading(true);
      const body = {
        email: email,
        password: password,
      };
      try {
        const data = await fetch(url, {
          method: "POST",
          body: JSON.stringify(body),
        });
        const response = await data.json();
        if (response.success) {
          if (response.data.result.isVerified) {
            router.push("/dashboard");
          } else {
            const serializedEvent = encodeURIComponent(
              JSON.stringify({
                access_token: response.data.result.access_token,
              })
            );
            router.push(
              `/account_verification?access_token=${serializedEvent}`
            );
          }
        } else {
          setErrors(true);
        }
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
      <div className="w-full">
        <p className="text-[#080a0b] text-[24px] font-bold leading-8 mb-4">
          Welcome back!
        </p>
        <p className="font-inter text-[#080a0b] text-base font-medium leading-6">
          Please enter your details.
        </p>
        <div className="mt-6">
          <label className="mb-1 font-inter text-[#080a0b] text-sm font-medium leading-5">
            Email Address
          </label>
          <div className="relative w-full">
            <input
              type="text"
              name="email"
              value={loginState.email}
              placeholder="Enter your email"
              onChange={handleInputChange}
              className="text-sm text-[#080a0b] border rounded-xl border-[#EEEEEE] h-[52px] py-3 px-1 w-full focus:outline-none"
            />
          </div>
        </div>
        <div className="mt-5">
          <label
            htmlFor=""
            className="mb-1 font-inter text-[#080a0b] text-sm font-medium leading-5"
          >
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
              className="text-sm text-[#080a0b] px-1 border rounded-xl border-[#EEEEEE] h-[52px] py-3 w-full focus:outline-none"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={handleShowPassword}
            >
              {/* {showPassword ? <Icons.ShowPassword /> : <Icons.HidePassword />} */}
            </span>
          </div>
        </div>
        <div className="pt-2 relative mt-6">
          <div
            className={`${errors ? "block" : "hidden"} text-center m-auto py-3`}
          >
            <p className="text-sm text-red-600">Invalid Email and Password</p>
          </div>
          <button
            className="text-base rounded-[25px] w-full p-3.5 font-medium bg-[#7a0860] text-white"
            onClick={() => handleSubmit(false)}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Continue"}
          </button>
        </div>
        <p className="text-sm mt-6 text-center text-[#94a3b8]">
          Or Signup with Google
        </p>
        <button
          className="mt-6 relative text-base rounded-xl text-black w-full p-3.5 font-medium hover:bg-white hover:border-[#221D3E] hover:text-[#221D3E] border-[#221D3E] border"
          disabled={isLoading}
        >
          {"Signup with google"}
        </button>
        <Link href="/signup">
          <p className="cursor-pointer mt-6 text-sm text-center text-[#080a0b]">
            Do you have an account? Get Started
          </p>
        </Link>
      </div>
    </div>
  );
}
