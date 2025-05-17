import { ConfigProvider } from "antd";
import type { PropsWithChildren } from "react";
import theme from "../themeConfig";

export default function AntdProvider({ children }: PropsWithChildren) {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
}
