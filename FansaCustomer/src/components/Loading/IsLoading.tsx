import React from "react";
import Header from "../Header";
import ReactLoading from "react-loading";

const IsLoading: React.FC = () => {
  return (
    <>
      <Header />
      <div className="mt-28 flex  h-full w-full flex-col items-center justify-center">
        <ReactLoading type={"spin"} color="green" height={100} width={100} />
        <h1 className="mt-2 text-2xl">Vui lòng chờ trong giây lát</h1>
      </div>
    </>
  );
};

export default IsLoading;
