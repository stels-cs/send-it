import "@/styles/globals.css";
import React from 'react';
import { ConfigProvider } from 'antd';
import type { AppProps } from "next/app";
import theme from './themeConfig';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export default function App({ Component, pageProps }: AppProps) {
  return  <ConfigProvider theme={theme}>
    <TonConnectUIProvider manifestUrl="https://stels-cs.github.io/tcm/manifest.json">
    <Component {...pageProps} />
    </TonConnectUIProvider>
  </ConfigProvider>;
}
