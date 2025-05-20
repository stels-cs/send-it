import { ConfigProvider } from "antd";
import type { PropsWithChildren } from "react";
import { StyleProvider } from '@ant-design/cssinjs';
import theme from "../themeConfig";

export default function AntdProvider({ children }: PropsWithChildren) {
  return <StyleProvider><ConfigProvider theme={theme}>{children}</ConfigProvider></StyleProvider>;
}
