"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

interface FormErrors {
  fullname?: string;
  email?: string;
  password?: string;
  form?: string;
}

export default function SignUpForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [userDetails, setUserDetails] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    fullname: false,
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const validateFullname = (name: string) => name.trim().length >= 3;
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(password);
  };

  // Real-time validation
  useEffect(() => {
    const newErrors: FormErrors = {};

    if (touched.fullname) {
      if (!userDetails.fullname) {
        newErrors.fullname = "Full name is required";
      } else if (!validateFullname(userDetails.fullname)) {
        newErrors.fullname = "Name must be at least 3 characters";
      }
    }

    if (touched.email) {
      if (!userDetails.email) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(userDetails.email)) {
        newErrors.email = "Please enter a valid email";
      }
    }

    if (touched.password) {
      if (!userDetails.password) {
        newErrors.password = "Password is required";
      } else if (!validatePassword(userDetails.password)) {
        newErrors.password =
          "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number";
      }
    }

    setErrors(newErrors);
  }, [userDetails, touched]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async () => {
    // Mark all fields as touched to show errors
    setTouched({
      fullname: true,
      email: true,
      password: true,
    });

    // Validate before submission
    const isFormValid =
      validateFullname(userDetails.fullname) &&
      validateEmail(userDetails.email) &&
      validatePassword(userDetails.password);

    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      const data = await response.json();
      if (data.success) {
        queryClient.setQueryData(["currentUser"], {
          id: data.id,
        });
        router.push(`/account_verification`);
      } else {
        setErrors({ form: data.error || "Registration failed" });
      }
    } catch (error) {
      setErrors({ form: error });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const signupForm = () => (
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
          Create your Account
        </p>
        <p className="mb-2 block text-[#5A5A5A] text-sm font-medium">
          Signup to Orkyst!
        </p>

        {/* Full Name Field */}
        <div className="mt-5">
          <label className="mb-2 block text-[#5A5A5A] text-sm font-medium">
            Full Name
          </label>
          <input
            type="text"
            name="fullname"
            value={userDetails.fullname}
            placeholder="Enter your full name"
            onChange={handleInputChange}
            onBlur={() => handleBlur("fullname")}
            className={`w-full h-[52px] px-4 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-inter leading-normal outline-none transition-all duration-200 focus:ring-2 ${
              errors.fullname ? "focus:ring-red-500" : "focus:ring-[#7a0860]"
            } focus:bg-[#F8F7F7] placeholder-[#8D8D8D]`}
          />
          {errors.fullname && (
            <p className="mt-1 text-sm text-red-600">{errors.fullname}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="mt-5">
          <label className="mb-2 block text-[#5A5A5A] text-sm font-medium">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={userDetails.email}
            placeholder="Enter your email"
            onChange={handleInputChange}
            onBlur={() => handleBlur("email")}
            className={`w-full h-[52px] px-4 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-inter leading-normal outline-none transition-all duration-200 focus:ring-2 ${
              errors.email ? "focus:ring-red-500" : "focus:ring-[#7a0860]"
            } focus:bg-[#F8F7F7] placeholder-[#8D8D8D]`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mt-5">
          <label className="mb-2 block text-[#5A5A5A] text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={userDetails.password}
              placeholder="Enter your password (6-20 characters)"
              onChange={handleInputChange}
              onBlur={() => handleBlur("password")}
              className={`w-full h-[52px] px-4 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-inter leading-normal outline-none transition-all duration-200 focus:ring-2 ${
                errors.password ? "focus:ring-red-500" : "focus:ring-[#7a0860]"
              } focus:bg-[#F8F7F7] placeholder-[#8D8D8D]`}
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

        {/* Form Error */}
        {errors.form && (
          <p className="mt-4 text-sm text-red-600">{errors.form}</p>
        )}

        {/* Submit Button */}
        <button
          className={`text-base rounded-xl w-full p-3.5 font-medium mt-6 bg-primary text-white hover:bg-primary-dark`}
          onClick={handleSubmit}
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
            "Next"
          )}
        </button>

        <Link href="/">
          <p className="cursor-pointer mt-6 text-sm text-center text-[#080a0b]">
            Already have an account?{" "}
            <span className="text-[#5CA0C2] hover:underline">Sign in</span>
          </p>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="pb-10 flex h-screen bg-[#ffffff] justify-center items-center">
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
      <div className="lg:min-w-[40%] min-w-[100%] lg:flex justify-start items-center">
        {signupForm()}
      </div>
    </div>
  );
}
