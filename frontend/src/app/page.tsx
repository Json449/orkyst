import Image from "next/image";
import LoginForm from "./component/LoginForm";

export default function Home() {
  return (
    <div className="pb-10 flex h-screen bg-[#ffffff] justify-center items-center">
      <div className="lg:min-w-[60%] relative lg:block hidden justify-center items-center w-full">
        <Image
          src="/images/loginbanner.svg"
          alt="Login Banner"
          layout="responsive"
          width={402}
          height={200}
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
        <LoginForm />
      </div>
    </div>
  );
}
