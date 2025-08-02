import React, { useState } from 'react';
import { Alert, Button, Form, Input } from 'antd';
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

interface FormValues {
  text: string;
}

const SingDataForm: React.FC = () => {
  const [ form ] = Form.useForm<FormValues>();
  const [ tonConnectUI ] = useTonConnectUI();
  const wallet = useTonWallet();
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState<null | unknown>(null);
  const [ result, setResult ] = useState<null | string>(null);


  const onFinish = (values: FormValues) => {
    console.log('Form values:', values);

    async function doJob() {
      return await tonConnectUI.signData({
        type: 'text',
        text: values.text
      })
    }

    setLoading(true)
    setResult(null)
    doJob()
      .then((s) => setResult(JSON.stringify(s, null, 2)))
      .catch(e => {
        setError(e)
        console.error("sendTransaction failed", e)
      })
      .finally(() => setLoading(false))
  };

  if (!wallet) {
    return <Alert
      message="Connect wallet"
      description="Connect wallet before using this form"
      type="info"
    />
  }

  return (
    <Form
      disabled={loading}
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      {!!result && <Alert type='info'
                          closable
                          message={<pre>${result}</pre>}
                          onClose={() => setResult(null)} />}
      {!!error && <Alert
        message={error instanceof Error ? error.message : JSON.stringify(error)}
        description={error instanceof Error ? error.stack : ''}
        type="error"
        closable
        onClose={() => setLoading(false)}
      />}
      <Form.Item
        label="Text"
        name="text"
        rules={[ { required: true, message: 'Fill text payload' } ]}
      >
        <Input placeholder="Hello world" />
      </Form.Item>


      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit">
            Sing data
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default SingDataForm;
