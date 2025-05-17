import { Flex, Layout, theme } from "antd";
import React from "react";
import { TonConnectButton } from "@tonconnect/ui-react";
import TonConnectForm from "@/components/TonConnectForm";
// import { theme } from 'antd';
// import { TonConnectButton } from "@tonconnect/ui-react";
// import TonConnectForm from "@/components/TonConnectForm";
const {Header,Content,Footer} = Layout

const MainPage: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return <Flex gap="middle" wrap>
    <Layout>
          <Header>
          <div style={{display:'flex', flexDirection:'row-reverse', height:'100%', alignItems:'center'}}>
            <TonConnectButton />
          </div>
          </Header>
          <Content>
            <div style={{maxWidth: '800px', background:colorBgContainer,borderRadius: borderRadiusLG,
              padding: '12px 24px', margin: '12px auto'}}>
              <TonConnectForm />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Demo app
          </Footer>
    </Layout>
  </Flex>
}

export default MainPage;
