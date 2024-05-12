import React from "react";
import Header from "../Header";
import { LuGithub } from "react-icons/lu";
function IsError() {
  return (
    <>
      <Header />
      <div className="container flex w-full items-center justify-center">
        <h1 className="mt-20 text-2xl font-bold text-red-600">
          Xin lỗi bạn về sự trục trặc này, trang web đang gặp sự cố !
        </h1>
        <LuGithub className="mt-20 text-2xl font-bold text-red-600" />
      </div>
    </>
  );
}

export default IsError;
