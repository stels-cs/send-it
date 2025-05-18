import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../components/MainPage"), {
  ssr: false,
});
const TonConnectForm = dynamic(() => import("../components/TonConnectForm"), {
  ssr: false,
});


const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Send it</title>
        <meta name="description" content="Send random transaction via Ton connect" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainPage>
        <TonConnectForm />
      </MainPage>
    </>
  );
};

export default HomePage;
