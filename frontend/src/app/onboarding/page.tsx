"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function FormData() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: "",
    audience: "",
    theme: "",
    contentTypes: "",
    posting: "",
  });
  const [errors, setErrors] = useState<any>(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const serializedEvent = searchParams.get("access_token");
  const access_token: Event | null = serializedEvent
    ? JSON.parse(decodeURIComponent(serializedEvent))
    : null;

  // Handle input change
  const handleFormData = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const updateProfile = async () => {
    const url = "/api/updateuser";
    setIsLoading(true);
    setErrors(null); // Clear previous errors
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ calendarInputs: formData, access_token }),
      });

      const result = await response.json();

      if (result.success) {
        router.replace("/dashboard");
      } else {
        setErrors(result?.data?.error || "Something went wrong");
      }
    } catch (error: any) {
      console.log("err", error);
      setErrors("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex w-full flex-col items-center justify-center bg-white h-[100vh]">
        <div className="flex h-screen bg-[#ffffff]">
          <div className="py-5 lg:min-w-[60%] relative lg:block hidden justify-center items-center w-full px-[54px]">
            <Image src={"./images/Orkyst.svg"} width={222} alt="" height={60} />
            <div className="w-full px-[102px]">
              <p className="mt-[54px] text-[#7a0860] text-[40px] font-open-sans font-bold leading-[52px] mb-[38px]">
                Tell Us About Yourself
              </p>
              {/* Input 1: Who is this for? */}
              <div className="mb-6">
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  placeholder="Are you creating this content calendar for a company, personal brand, or another initiative?"
                  onChange={handleFormData}
                  className="w-full h-[72px] px-4 py-3 border border-[#c7cad4] rounded-lg bg-[#fffefe] text-[#8087a1] text-[20px] font-open-sans leading-[26px] outline-none"
                />
              </div>
              {/* Input 2: Which audience is it for? */}
              <div className="mb-6">
                <input
                  type="text"
                  name="audience"
                  value={formData.audience}
                  placeholder="What region is your audience located in, and are there any holidays or events this month you’d like to highlight?"
                  onChange={handleFormData}
                  className="w-full h-[72px] px-4 py-3 border border-[#c7cad4] rounded-lg bg-[#fffefe] text-[#8087a1] text-[20px] font-open-sans leading-[26px] outline-none"
                />
              </div>
              {/* Dropdown 1: What’s this month’s audience? */}
              <div className="mb-6">
                <input
                  type="text"
                  name="theme"
                  value={formData.theme}
                  placeholder="What is the primary theme or message you want to emphasize this month?"
                  onChange={handleFormData}
                  className="w-full h-[72px] px-4 py-3 border border-[#c7cad4] rounded-lg bg-[#fffefe] text-[#8087a1] text-[20px] font-open-sans leading-[26px] outline-none"
                />
              </div>
              {/* Input 4: What content types? */}
              <div className="mb-6">
                <input
                  type="text"
                  name="contentTypes"
                  value={formData.contentTypes}
                  placeholder="What types of content do you prefer to post? (e.g., social media posts, blogs, videos, polls)"
                  onChange={handleFormData}
                  className="w-full h-[72px] px-4 py-3 border border-[#c7cad4] rounded-lg bg-[#fffefe] text-[#8087a1] text-[20px] font-open-sans leading-[26px] outline-none"
                />
              </div>
              {/* Dropdown 2: Do you have a posting? */}
              <div className="mb-6">
                <input
                  type="posting"
                  name="posting"
                  value={formData.posting}
                  placeholder="How often would you like to post? (e.g., daily, three times a week, or specific days)"
                  onChange={handleFormData}
                  className="w-full h-[72px] px-4 py-3 border border-[#c7cad4] rounded-lg bg-[#fffefe] text-[#8087a1] text-[20px] font-open-sans leading-[26px] outline-none"
                />
              </div>
              {errors && <p className="text-lg text-red-600 mb-4">{errors}</p>}
              <div className="flex justify-between">
                <button
                  disabled={isLoading}
                  className="cursor-pointer w-[267px] h-[72px] bg-[#7a0860] text-[#fffefe] text-[20px] font-open-sans font-medium leading-[26px] rounded-lg outline-none"
                  onClick={updateProfile}
                >
                  {isLoading ? "Loading..." : "Next"}
                </button>
                <button
                  onClick={() => router.back()}
                  disabled={isLoading}
                  className="w-[267px] h-[72px] bg-white text-[#7a0860] text-[20px] font-open-sans font-medium leading-[26px] rounded-lg border border-[#7a53f5] outline-none"
                >
                  Skip Form Manual Calendar
                </button>
              </div>
            </div>
          </div>
          <div className="lg:min-w-[40%] min-w-[100%] bg-[#7a0860] lg:flex justify-center items-center w-full">
            <p className="text-[#fffefe] mx-[64px] text-[24px] font-open-sans leading-[31px] text-center">
              {`Orkyst's is a centralized AI-powered <br /> platform to create,
            deploy, and analyze <br /> campaigns seamlessly.
            <br /> AI tool for brands and agencies to collaborate, reach
            audiences, and measure success with precision.`}
            </p>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default function OnBoarding() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormData />
    </Suspense>
  );
}
