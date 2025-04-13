"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Define a more general error interface (for better structure handling)
interface CustomError {
  error: string;
}

export default function SignUpForm() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<string | boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    const { email, password, fullname } = userDetails;
    const url = "/api/signup";
    setIsLoading(true);
    const body = {
      email,
      password,
      fullname,
    };
    try {
      const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
      });
      const response = await data.json();
      if (response?.success) {
        const serializedEvent = encodeURIComponent(
          JSON.stringify({
            access_token: response.data.access_token,
          })
        );
        router.push(`/account_verification?access_token=${serializedEvent}`);
      } else {
        setErrors(response?.error || "An error occurred");
      }
    } catch (ex: unknown) {
      if (ex instanceof Error) {
        setErrors(ex.message); // Handle general errors
      } else if (ex && (ex as CustomError).error) {
        setErrors((ex as CustomError).error); // Handle specific error structure
      } else {
        setErrors("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle password visibility
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center bg-white h-[100vh]">
      {/* Step 1: Full Name, Email, Password */}
      <div className="w-[600px] p-[32px] bg-white rounded-3xl shadow-lg p-6">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-[#7a0860] h-2 rounded-full"
            style={{ width: "33%" }} // 33% progress for Step 1
          ></div>
        </div>

        <p className="text-[#080a0b] text-[24px] font-bold leading-8 mb-4">
          Create Your Account
        </p>
        <p className="font-inter text-[#080a0b] text-base font-medium leading-6 mb-6">
          Please enter your details.
        </p>
        <div className="space-y-4">
          <div>
            <label className="mb-1 font-inter text-[#080a0b] text-sm font-medium leading-5">
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              value={userDetails.fullname}
              placeholder="Enter your full name"
              onChange={handleInputChange}
              className="text-sm text-[#080a0b] border rounded-xl border-[#EEEEEE] h-[52px] py-3 px-4 w-full focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 font-inter text-[#080a0b] text-sm font-medium leading-5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={userDetails.email}
              placeholder="Enter your email"
              onChange={handleInputChange}
              className="text-sm text-[#080a0b] border rounded-xl border-[#EEEEEE] h-[52px] py-3 px-4 w-full focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 font-inter text-[#080a0b] text-sm font-medium leading-5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={userDetails.password}
                placeholder="Enter your password"
                onChange={handleInputChange}
                className="text-sm text-[#080a0b] border rounded-xl border-[#EEEEEE] h-[52px] py-3 px-4 w-full focus:outline-none"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={handleShowPassword}
              >
                {/* {showPassword ? <Icons.ShowPassword /> : <Icons.HidePassword />} */}
              </span>
            </div>
          </div>
        </div>
        {errors && <p className="text-sm text-red-600 mt-4">{errors}</p>}
        <button
          className="text-base rounded-xl w-full p-3.5 font-medium bg-[#7a0860] text-white mt-6"
          onClick={handleSubmit}
        >
          {isLoading ? "Loading..." : "Next"}
        </button>
      </div>
    </div>
  );
}
