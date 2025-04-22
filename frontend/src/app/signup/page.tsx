"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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

  const signupForm = () => {
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
            Create your Account
          </p>
          <div className="mt-5">
            <label className="mb-2 block text-[#5A5A5A] text-sm font-medium">
              Signup to Orkyst!
            </label>
            <div className="mt-5">
              <label className="mb-2 block text-[#5A5A5A] text-sm font-medium">
                Full Name
              </label>
              <div className="relative w-full">
                <input
                  type="text"
                  name="fullname"
                  value={userDetails.fullname}
                  placeholder="Enter your full name"
                  onChange={handleInputChange}
                  className="w-full h-[52px] px-4 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-inter leading-normal outline-none transition-all duration-200 focus:ring-2 focus:ring-[#7a0860] focus:bg-[#F8F7F7] placeholder-[#8D8D8D]"
                />
              </div>
            </div>
          </div>

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
              className="w-full h-[52px] px-4 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-inter leading-normal outline-none transition-all duration-200 focus:ring-2 focus:ring-[#7a0860] focus:bg-[#F8F7F7] placeholder-[#8D8D8D]"
            />
          </div>
          <div className="mt-5">
            <label className="mb-2 block text-[#5A5A5A] text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={userDetails.password}
                placeholder="Enter your password"
                onChange={handleInputChange}
                className="w-full h-[52px] px-4 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-inter leading-normal outline-none transition-all duration-200 focus:ring-2 focus:ring-[#7a0860] focus:bg-[#F8F7F7] placeholder-[#8D8D8D]"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={handleShowPassword}
              >
                {/* {showPassword ? <Icons.ShowPassword /> : <Icons.HidePassword />} */}
              </span>
            </div>
          </div>
          {errors && <p className="text-sm text-red-600 mt-4">{errors}</p>}
          <button
            className="text-base rounded-xl w-full p-3.5 font-medium bg-primary text-white mt-6"
            onClick={handleSubmit}
          >
            {isLoading ? "Loading..." : "Next"}
          </button>
          <Link href="/">
            <p className="cursor-pointer mt-6 text-sm text-center text-[#080a0b]">
              Already have an account?{"  "}
              <span className="text-[#5CA0C2]">Signin</span>
            </p>
          </Link>
        </div>
      </div>
    );
  };

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
