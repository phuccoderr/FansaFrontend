import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiReactjsFill } from "react-icons/ri";
import { GrMysql } from "react-icons/gr";
import { TbBrandTypescript } from "react-icons/tb";
import { RiTailwindCssFill } from "react-icons/ri";
import { SiShadcnui } from "react-icons/si";
import { FaJava } from "react-icons/fa";
import SigninAccount from "@/components/account/SigninAccount";
import RegisterAccount from "@/components/account/RegisterAccount";

const Login: React.FC = () => {
  return (
    <div className="absolute flex h-full w-full ">
      <div className="hidden flex-col bg-[#18181b] lg:flex lg:w-full">
        <div className="ml-4 p-4 text-3xl font-bold text-white">
          <h1>Fansa</h1>
        </div>
        <div className="my-auto flex items-center justify-center gap-6 p-4 text-white">
          <div className="flex flex-col items-center">
            <RiReactjsFill className="text-7xl" />
            <h1>ReactJS</h1>
          </div>
          <div className="flex flex-col items-center">
            <RiTailwindCssFill className="text-7xl" />
            <h1>Tailwind</h1>
          </div>
          <div className="flex flex-col items-center">
            <SiShadcnui className="text-7xl" />
            <h1>Shadcn UI</h1>
          </div>
          <div className="flex flex-col items-center">
            <GrMysql className="text-7xl" />
            <h1>MySQL</h1>
          </div>
          <div className="flex flex-col items-center">
            <TbBrandTypescript className="text-7xl" />
            <h1>TypeScript</h1>
          </div>
          <div className="flex flex-col items-center">
            <FaJava className="text-7xl" />
            <h1>Spring Boot</h1>
          </div>
        </div>
        <div className="mt-auto p-4 font-semibold text-white">
          <p>
            Acme Inc “This library has saved me countless hours of work and
            helped me deliver stunning designs to my clients faster than ever
            before.” Sofia Davis
          </p>
        </div>
      </div>
      <div className="flex w-full items-center justify-center ">
        <Tabs defaultValue="signin" className="sm:w-[400px] ">
          <div className="flex items-center justify-center font-bold uppercase lg:hidden">
            Chào mừng bạn đến với Group 12
          </div>
          <TabsList className="grid w-full grid-cols-2 rounded bg-gray-300">
            <TabsTrigger
              className="w-full cursor-pointer rounded hover:bg-gray-500"
              value="signin"
            >
              Login
            </TabsTrigger>
            <TabsTrigger className="w-full" value="register">
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <SigninAccount />
          </TabsContent>
          <TabsContent value="register">
            <RegisterAccount />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
