import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../components/MainPage"), {
  ssr: false,
});
const SingDataForm = dynamic(() => import("../components/SingDataForm"), {
  ssr: false,
});


const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Sing data</title>
        <meta name="description" content="Debug sing data" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainPage>
        <SingDataForm />
      </MainPage>
    </>
  );
};

export default HomePage;
