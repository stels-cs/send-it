import React, { useRef, useState } from 'react';
import { Alert, Button, Form, Input } from 'antd';
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { SendTransactionRequest } from "@tonconnect/sdk";
import { Address, toNano } from "@ton/core";
import { NftItemMessages } from "@/messages";
import { useRouter } from "next/router";

interface FormValues {
  nftAddress: string;
  forwardAmount: string;
}

const NftTransferForm: React.FC = () => {
  const router = useRouter();
  const [ form ] = Form.useForm<FormValues>();
  const [ tonConnectUI ] = useTonConnectUI();
  const wallet = useTonWallet();
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState<null | unknown>(null);
  const refHack = useRef({exportHack:false})


  const onFinish = (values: FormValues) => {
    console.log('Form values:', values);

    async function doJob() {
      const nftAddress = Address.parse(values.nftAddress)
      const forwardAmount = toNano(values.forwardAmount)
      if (!wallet) {
        throw new Error('connect wallet')
      }

      const body = NftItemMessages.transfer({
        newOwner: Address.parse('UQB5HQfjevz9su4ZQGcDT_4IB0IUGh5PM2vAXPU2e4O6_YBm'),
        forwardAmount: forwardAmount,
        responseTo: Address.parse(wallet.account.address),
      })

      const tx: SendTransactionRequest = {
        validUntil: Date.now() + 1000 * 60 * 5,
        from: Address.parse(wallet.account.address).toString(),
        messages: [
          {
            address: nftAddress.toString(),
            amount: (forwardAmount + toNano('0.05')).toString(),
            payload: body.toBoc().toString('base64'),
          }
        ]
      }
      console.info('Payload', tx);

      if (refHack.current.exportHack) {
        refHack.current.exportHack = false
        await router.push({
          pathname: '/',
          query: {
            tx: JSON.stringify(tx)
          }
        })
        return
      }
      await tonConnectUI.sendTransaction(tx, { modals: 'all' })
    }

    setLoading(true)
    doJob()
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
      <Alert
        message="Баг с трансфером NFT"
        description={<>Судя по всему, iOS-клиент (версия 5.2.2) неправильно рассчитывает сумму транзакции, когда во время трансфера NFT передаются токены через параметр forwardAmount.
          Для воспроизведения ошибки нужно ввести адрес NFT, которой вы владеете, и указать forwardAmount, чуть превышающий половину баланса кошелька.</>}
        type="info"
      />
      <br/>
      {!!error && <Alert
        message={error instanceof Error ? error.message : JSON.stringify(error)}
        description={error instanceof Error ? error.stack : ''}
        type="error"
        closable
        onClose={() => setLoading(false)}
      />}
      <Form.Item
        label="NFT Address"
        name="nftAddress"
        rules={[ { required: true, message: 'Fill json payload' } ]}
      >
        <Input placeholder="EQ..." />
      </Form.Item>
      <Form.Item
        label="Forward amount"
        name="forwardAmount"
        rules={[ { required: true, message: 'Fill ton' } ]}
      >
        <Input addonAfter={'TON'} placeholder="5" />
      </Form.Item>


      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit">
            Send
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => {
            refHack.current.exportHack = true
          }} loading={loading} type="default" htmlType="submit">
            Export
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default NftTransferForm;
