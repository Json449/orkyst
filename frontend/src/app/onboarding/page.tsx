"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function FormData() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    whoIsThisFor: "",
    businessType: "",
    targetAudience: "",
    marketingGoals: [] as string[],
    domains: [] as string[],
    postingFrequency: [] as string[],
    preferredContentType: [] as string[],
  });
  const [errors, setErrors] = useState<any>(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const serializedEvent = searchParams.get("access_token");
  const access_token: Event | null = serializedEvent
    ? JSON.parse(decodeURIComponent(serializedEvent))
    : null;

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;

    setFormData((prevState) => {
      if (checked) {
        return {
          ...prevState,
          [name]: [...prevState[name as keyof typeof prevState], value],
        };
      } else {
        return {
          ...prevState,
          [name]: prevState[name as keyof typeof prevState].filter(
            (item: string) => item !== value
          ),
        };
      }
    });
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
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

  console.log("view form data", formData);

  // Step counter component
  const StepCounter = () => (
    <div className="flex justify-center items-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium
                ${currentStep >= step ? "bg-[#7a0860]" : "bg-gray-300"}`}
            >
              {step}
            </div>
          </div>
          {step < 4 && (
            <div
              className={`w-16 h-1 mx-2 ${
                currentStep > step ? "bg-[#7a0860]" : "bg-gray-300"
              }`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Step 1: Basic Information
  const Step1 = () => (
    <div className="space-y-6">
      <div className="relative">
        <label className="block text-[#5A5A5A] text-sm font-medium mb-1">
          Who is this for?
        </label>
        <input
          type="text"
          name="whoIsThisFor"
          value={formData.whoIsThisFor}
          onChange={handleInputChange}
          className="w-full h-[60px] px-5 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-open-sans leading-normal outline-none transition-all duration-200 focus:ring-2 focus:ring-[#7a0860] focus:bg-[#F8F7F7] placeholder-[#8D8D8D]"
          placeholder="Company, brand or other"
        />
      </div>

      <div className="relative">
        <label className="block text-[#5A5A5A] text-sm font-medium mb-1">
          Business Type
        </label>
        <select
          name="businessType"
          value={formData.businessType}
          onChange={(e) => handleInputChange(e as any)}
          className="w-full h-[60px] px-5 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-open-sans leading-normal outline-none transition-all duration-200 focus:ring-2 focus:ring-[#7a0860] focus:bg-[#F8F7F7]"
        >
          <option value="">Select a business type</option>
          <option value="B2B">B2B</option>
          <option value="B2C">B2C</option>
          <option value="Agency">Agency</option>
          <option value="E-commerce">E-commerce</option>
          <option value="SaaS">SaaS</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="relative">
        <label className="block text-[#5A5A5A] text-sm font-medium mb-1">
          Target audience
        </label>
        <input
          type="text"
          name="targetAudience"
          value={formData.targetAudience}
          onChange={handleInputChange}
          className="w-full h-[60px] px-5 py-3 rounded-lg bg-[#F2EFEF] text-[#8D8D8D] text-[16px] font-open-sans leading-normal outline-none transition-all duration-200 focus:ring-2 focus:ring-[#7a0860] focus:bg-[#F8F7F7] placeholder-[#8D8D8D]"
          placeholder="Describe your target audience"
        />
      </div>
    </div>
  );

  // Step 2: Marketing Goals
  const Step2 = () => (
    <div className="space-y-6">
      <h3 className="text-[#5A5A5A] text-lg font-medium mb-4">
        What are your marketing goals? Select all that apply
      </h3>

      {[
        "Increase Brand awareness",
        "Generate more leads",
        "Increase social media engagement",
        "Boost sales/conversions",
        "Improve customers retention",
      ].map((goal) => (
        <div key={goal} className="flex items-center">
          <input
            type="checkbox"
            id={goal}
            name="marketingGoals"
            value={goal}
            checked={formData.marketingGoals.includes(goal)}
            onChange={handleCheckboxChange}
            className="h-5 w-5 rounded border-gray-300 text-[#7a0860] focus:ring-[#7a0860]"
          />
          <label htmlFor={goal} className="ml-2 text-[#5A5A5A]">
            {goal}
          </label>
        </div>
      ))}
    </div>
  );

  // Step 3: Domains
  const Step3 = () => (
    <div className="space-y-6">
      <h3 className="text-[#5A5A5A] text-lg font-medium mb-4">
        Choose your domains. Select all that apply
      </h3>

      {["Linkedin", "Facebook", "Instagram", "Blog articles"].map((domain) => (
        <div key={domain} className="flex items-center">
          <input
            type="checkbox"
            id={domain}
            name="domains"
            value={domain}
            checked={formData.domains.includes(domain)}
            onChange={handleCheckboxChange}
            className="h-5 w-5 rounded border-gray-300 text-[#7a0860] focus:ring-[#7a0860]"
          />
          <label htmlFor={domain} className="ml-2 text-[#5A5A5A]">
            {domain}
          </label>
        </div>
      ))}
    </div>
  );

  // Step 4: Posting Frequency and Content Type
  const Step4 = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-[#5A5A5A] text-lg font-medium mb-4">
          How often do you want to post?
        </h3>

        {[
          "Light (1-2 times per week)",
          "Medium (3-4 times per week)",
          "Heavy (5+ times per week)",
        ].map((frequency) => (
          <div key={frequency} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={frequency}
              name="postingFrequency"
              value={frequency}
              checked={formData.postingFrequency.includes(frequency)}
              onChange={handleCheckboxChange}
              className="h-5 w-5 rounded border-gray-300 text-[#7a0860] focus:ring-[#7a0860]"
            />
            <label htmlFor={frequency} className="ml-2 text-[#5A5A5A]">
              {frequency}
            </label>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-[#5A5A5A] text-lg font-medium mb-4">
          Preferred content type
        </h3>

        {["Educational", "Promotional", "Engagement", "Storytelling"].map(
          (contentType) => (
            <div key={contentType} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={contentType}
                name="preferredContentType"
                value={contentType}
                checked={formData.preferredContentType.includes(contentType)}
                onChange={handleCheckboxChange}
                className="h-5 w-5 rounded border-gray-300 text-[#7a0860] focus:ring-[#7a0860]"
              />
              <label htmlFor={contentType} className="ml-2 text-[#5A5A5A]">
                {contentType}
              </label>
            </div>
          )
        )}
      </div>
    </div>
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex w-full flex-col bg-white h-[100vh]">
        <div className="flex h-screen bg-[#ffffff]">
          <div className="py-5 lg:min-w-[50%] relative lg:flex flex-col items-center justify-center w-full px-[54px]">
            <Image
              src="/logo.svg"
              alt="Login Banner"
              width={228}
              height={76}
              priority
            />
            <div className="w-full px-[102px]">
              <p className="mt-[54px] text-[#000000] text-[28px] font-open-sans font-bold mb-[20px]">
                {"Answer few questions to create your first calendar"}
              </p>

              {/* Step counter with circles */}
              <StepCounter />
              <p className="text-[#000000] text-[24px] font-open-sans font-bold mb-[8px]">
                {currentStep === 1 && "Tell us about your business"}
                {currentStep === 2 && "What are your marketing goals?"}
                {currentStep === 3 && "Where do you want to post?"}
                {currentStep === 4 && "Posting preferences"}
              </p>
              {/* Render current step */}
              {currentStep === 1 && Step1()}
              {currentStep === 2 && Step2()}
              {currentStep === 3 && Step3()}
              {currentStep === 4 && Step4()}

              {errors && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
                  {errors}
                </div>
              )}

              <div className="flex justify-between gap-5 mt-8">
                {currentStep > 1 ? (
                  <button
                    onClick={prevStep}
                    disabled={isLoading}
                    className="w-[157px] h-[50px] bg-white text-[#7a0860] text-[16px] font-medium rounded-lg border-2 border-[#7a0860] hover:bg-[#F8F7F7] transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 4 ? (
                  <button
                    onClick={nextStep}
                    disabled={isLoading}
                    className="w-[157px] h-[50px] bg-[#7a0860] text-white text-[16px] font-medium rounded-lg hover:bg-[#5c0648] transition-colors disabled:opacity-70"
                  >
                    Next
                  </button>
                ) : (
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
                      "Finish"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="lg:min-w-[50%] min-w-[100%] bg-[#7a0860] hidden lg:block lg:flex justify-center items-center w-full">
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
