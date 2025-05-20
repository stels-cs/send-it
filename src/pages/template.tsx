import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../components/MainPage"), {
  ssr: false,
});
const TemplatePicker = dynamic(() => import("../components/TemplatePicker"), {
  ssr: false,
});


const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>TON Connect playground</title>
        <meta name="description" content="Layout for nft transfer bug" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainPage>
        <TemplatePicker />
      </MainPage>
    </>
  );
};

export default HomePage;
