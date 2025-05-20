import { Flex, Layout, theme } from "antd";
import React, { type PropsWithChildren } from "react";
import { TonConnectButton } from "@tonconnect/ui-react";

const { Header, Content, Footer } = Layout

const MainPage: React.FC<PropsWithChildren> = (props) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return <Flex gap="middle" wrap>
    <Layout>
      <Header>
        <div style={{ display: 'flex', flexDirection: 'row-reverse', height: '100%', alignItems: 'center' }}>
          <TonConnectButton />
        </div>
      </Header>
      <Content>
        <div style={{
          maxWidth: '800px', background: colorBgContainer, borderRadius: borderRadiusLG,
          padding: '12px 24px', margin: '12px auto'
        }}>
          {props.children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Demo app
      </Footer>
    </Layout>
  </Flex>
}

export default MainPage;
