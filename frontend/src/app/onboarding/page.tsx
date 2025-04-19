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

  const handleFormData = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const updateProfile = async () => {
    const url = "/api/updateuser";
    setIsLoading(true);
    setErrors(null);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ calendarInputs: formData, access_token }),
      });

      const result = await response.json();
      console.log("check now", result);
      if (result.success) {
        router.replace("/dashboard");
      } else {
        setErrors(result?.data?.error || "Something went wrong");
      }
    } catch (error: any) {
      console.log("err", error);
      setErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex w-full flex-col bg-white h-[100vh]">
        <div className="flex h-screen bg-[#ffffff]">
          <div className="py-5 lg:min-w-[60%] relative lg:block hidden justify-center items-center w-full px-[54px]">
            <Image
              src="/logo.svg"
              alt="Login Banner"
              width={228}
              height={76}
              priority
            />
            <div className="w-full px-[102px]">
              <p className="mt-[54px] text-[#000000] text-[28px] font-open-sans font-bold leading-[52px] mb-[28px]">
                Create your first Calendar
              </p>

              {/* Enhanced Input Fields */}
              <div className="space-y-6">
                {/* Input 1 */}
                <div className="relative">
                  <label className="block text-[#5A5A5A] text-sm font-medium mb-1">
                    Who is this for?
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleFormData}
                    className="w-full h-[60px] px-5 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-open-sans leading-normal outline-none transition-all duration-200 focus:ring-2 focus:ring-[#7a0860] focus:bg-[#F8F7F7] placeholder-[#8D8D8D]"
                    placeholder="Company, personal brand, or initiative?"
                  />
                </div>

                {/* Input 2 */}
                <div className="relative">
                  <label className="block text-[#5A5A5A] text-sm font-medium mb-1">
                    Target audience
                  </label>
                  <input
                    type="text"
                    name="audience"
                    value={formData.audience}
                    onChange={handleFormData}
                    className="w-full h-[60px] px-5 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-open-sans leading-normal outline-none transition-all duration-200 focus:ring-2 focus:ring-[#7a0860] focus:bg-[#F8F7F7] placeholder-[#8D8D8D]"
                    placeholder="Audience location and important dates"
                  />
                </div>

                {/* Input 3 */}
                <div className="relative">
                  <label className="block text-[#5A5A5A] text-sm font-medium mb-1">
                    Monthly theme
                  </label>
                  <input
                    type="text"
                    name="theme"
                    value={formData.theme}
                    onChange={handleFormData}
                    className="w-full h-[60px] px-5 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-open-sans leading-normal outline-none transition-all duration-200 focus:ring-2 focus:ring-[#7a0860] focus:bg-[#F8F7F7] placeholder-[#8D8D8D]"
                    placeholder="Primary message or theme"
                  />
                </div>

                {/* Input 4 */}
                <div className="relative">
                  <label className="block text-[#5A5A5A] text-sm font-medium mb-1">
                    Content types
                  </label>
                  <input
                    type="text"
                    name="contentTypes"
                    value={formData.contentTypes}
                    onChange={handleFormData}
                    className="w-full h-[60px] px-5 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-open-sans leading-normal outline-none transition-all duration-200 focus:ring-2 focus:ring-[#7a0860] focus:bg-[#F8F7F7] placeholder-[#8D8D8D]"
                    placeholder="Preferred content formats"
                  />
                </div>

                {/* Input 5 */}
                <div className="relative">
                  <label className="block text-[#5A5A5A] text-sm font-medium mb-1">
                    Posting frequency
                  </label>
                  <input
                    type="text"
                    name="posting"
                    value={formData.posting}
                    onChange={handleFormData}
                    className="w-full h-[60px] px-5 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-open-sans leading-normal outline-none transition-all duration-200 focus:ring-2 focus:ring-[#7a0860] focus:bg-[#F8F7F7] placeholder-[#8D8D8D]"
                    placeholder="How often to post?"
                  />
                </div>
              </div>

              {errors && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
                  {errors}
                </div>
              )}

              <div className="flex justify-end gap-5 mt-8">
                <button
                  onClick={() => router.back()}
                  disabled={isLoading}
                  className="w-[157px] h-[50px] bg-white text-[#7a0860] text-[16px] font-medium rounded-lg border-2 border-[#7a0860] hover:bg-[#F8F7F7] transition-colors"
                >
                  Setup Manually
                </button>
                <button
                  disabled={isLoading}
                  onClick={updateProfile}
                  className="w-[157px] h-[50px] bg-[#7a0860] text-white text-[16px] font-medium rounded-lg hover:bg-[#5c0648] transition-colors disabled:opacity-70"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              </div>
            </div>
          </div>
          <div className="lg:min-w-[40%] min-w-[100%] bg-[#7a0860] lg:flex justify-center items-center w-full">
            <div>
              <h3 className="text-[#fffefe] text-[30px] font-bold text-start">
                Faster Execution, Fewer Bottlenecks
              </h3>
              <Image
                src="/images/onboarding_banner.svg"
                alt="Login Banner"
                width={624}
                height={279}
                style={{
                  margin: "90px 0 75px 0",
                }}
                priority
              />
              <p className="text-[#fffefe] text-[30px] mt-8 font-bold text-start">
                AI-Powered Campaigns
              </p>
              <p className="text-[#fffefe] text-[30px] font-bold text-end">
                All-in-One Marketing Hub
              </p>
            </div>
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
