import "@/styles/globals.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";

const AntdProvider = dynamic(() => import("../components/AntdProvider"), {
  ssr: false,
});

export default function App({ Component, pageProps }: AppProps) {
  return <AntdProvider>
    <TonConnectUIProvider manifestUrl="https://stels-cs.github.io/tcm/manifest.json">
      <Component {...pageProps} />
    </TonConnectUIProvider>
  </AntdProvider>;
}
