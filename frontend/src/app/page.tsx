import Image from "next/image";
import LoginForm from "./component/LoginForm";

export default function Home() {
  return (
    <div className="flex h-screen pt-[52px] p-10 bg-[#ffffff] justify-center items-center">
      <div className="lg:min-w-[50%] relative lg:block hidden justify-center items-center w-full">
        <Image
          src="/images/loginbanner.svg"
          alt="Login Banner"
          layout="responsive" // Ensures the image covers full width
          width={631} // Width of the image to match the aspect ratio
          height={380} // Height of the image to match the aspect ratio
          objectFit="cover" // Ensures the image covers the full container
          objectPosition="center"
          priority
        />
        <div className="p-4 items-center justify-center text-center mt-4 w-full h-[54px] bg-white rounded-[8px] border border-[#eeeeee] box-border shadow-md">
          <p className="font-inter text-[#080a0b] text-sm font-medium leading-5 text-center">
            AI-led marketing orchestration to help you build, post and measure
            each engagement.
          </p>
        </div>
      </div>
      <div className="lg:min-w-[50%] min-w-[100%] lg:flex justify-center items-center">
        <LoginForm />
      </div>
    </div>
  );
}
