import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Input } from 'antd';
import { useRouter } from "next/router";
import { createDefaultTransactionPayload, exportFormData } from "@/init";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { SendTransactionRequest } from "@tonconnect/sdk";

interface FormValues {
  payload: string;
}

const TonConnectForm: React.FC = () => {
  const router = useRouter();
  const { tx } = router.query;
  const [ form ] = Form.useForm<FormValues>();
  const [ tonConnectUI ] = useTonConnectUI();
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState<null | unknown>(null);
  const [ exportData, setExport ] = useState<null | string>(null);

  useEffect(() => {
    const payload = createDefaultTransactionPayload(tx);
    if (payload) {
      form.setFieldsValue(payload);
    }
  }, [ form, tx ]);

  const onFinish = (values: FormValues) => {
    console.log('Form values:', values);

    const data = JSON.parse(values.payload);
    setLoading(true)
    tonConnectUI.sendTransaction(data as SendTransactionRequest, { modals: 'all' })
      .catch(e => {
        setError(e)
        console.error("sendTransaction failed", e)
      })
      .finally(() => setLoading(false))
  };

  return (
    <Form
      disabled={loading}
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      {!!error && <Alert
        message={error instanceof Error ? error.message : JSON.stringify(error)}
        description={error instanceof Error ? error.stack : ''}
        type="error"
        closable
        onClose={() => setLoading(false)}
      />}
      <Form.Item
        label="Transaction"
        name="payload"
        rules={[ { required: true, message: 'Fill json payload' } ]}
      >
        <Input.TextArea rows={15}
                        placeholder="" />
      </Form.Item>

      {!!exportData && <div style={{ marginBottom: '15px' }}>
        <Input.TextArea rows={3}
                        readOnly={true}
                        placeholder="" defaultValue={exportData} />
      </div>}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit">
            Send
          </Button>
        </Form.Item>
        <Button onClick={() => {
          setExport(exportFormData(form.getFieldValue('payload').toString()))
        }} type="default">Export</Button>
      </div>

    </Form>
  );
};

export default TonConnectForm;
