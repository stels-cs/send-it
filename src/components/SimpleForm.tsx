import { Form, Input, Button } from 'antd';

interface FormValues {
  address: string;
  amount: string;
}

const SimpleForm: React.FC = () => {
  const [form] = Form.useForm<FormValues>();

  const onFinish = (values: FormValues) => {
    console.log('Form values:', values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 400, margin: '20px 15px' }}
    >
      <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true, message: 'Fill ton address' }]}
      >
        <Input.TextArea rows={3} placeholder="UQ.. or EQ.. or 0:123.." />
      </Form.Item>

      <Form.Item
        label="Amount"
        name="amount"
        rules={[
          { required: true, message: 'Input ton amount' },
        ]}
      >
        <Input placeholder="0.01" addonAfter="TON" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SimpleForm;
