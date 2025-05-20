import React from "react";
import { Button, message } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";


const ShareCopyButton: React.FC<{ getUrl: () => string|null }> = ({ getUrl }) => {
  const [messageApi, context] = message.useMessage();
  return <>{context}<div style={{float:'right'}}>
      <Button type="dashed"
              shape="circle"
              onClick={() => {
                const url = getUrl()
                if (!url) {
                  messageApi.error('No link')
                  return
                }
                navigator.clipboard.writeText(url).then(
                  async () => {
                    messageApi.success('Link copied')
                  },
                  async () => {
                    messageApi.error('Fail to copy link')
                  },
                );
              }}
              icon={<ShareAltOutlined />} />
  </div></>
}

export default ShareCopyButton
