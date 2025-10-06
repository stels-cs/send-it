import React, { useMemo } from "react";
import { Cell } from "@ton/core";
import { Typography, Card } from "antd";
import { t } from "@/getLang";
import { CHAIN, useTonConnectUI } from "@tonconnect/ui-react";
const {Link,Paragraph} = Typography


const ResultAlert: React.FC<{ boc: string, ui?:{text:string, link?:string} }> = ({ boc, ui }) => {
  const [ tonConnectUI ] = useTonConnectUI();

  const explorerPrefix = tonConnectUI.account?.chain === CHAIN.MAINNET
    ? 'https://tonviewer.com'
    : 'https://testnet.tonviewer.com'

  const result = useMemo(() => {
    const txHash = Cell.fromBase64(boc).hash()
    const txUrl = `${explorerPrefix}/transaction/${txHash.toString('hex')}`
    return {
      url: txUrl,
      hashBase64: txHash.toString('base64'),
      hashHex: txHash.toString('hex'),
      boc: boc,
    }
  }, [ boc, explorerPrefix ])



  return <Card size="small" title={t({
    en:'Transaction sent successfully!',
    ru: 'Транзакция успешно отправлена!'
  })}>
    {!!ui && <Paragraph>
      {ui.text}
      {!!ui.link && <br/>}
      {!!ui.link && <Link href={ui.link} target='_blank'>{ui.link}</Link>}
    </Paragraph>}
    <Paragraph>{t({
      en:"This is a link to the transaction in the explorer. It may take up to 30 seconds to appear",
      ru: 'Это ссылка на транзакцию в эксплорере, транзакция появляется не мгновенно, эта ссылка заработает через полминуты'
    })}: <Link href={result.url} target='_blank'>{result.url}</Link></Paragraph>
    <Paragraph>{t({
      en:'External message hash (base64)',
      ru:'Хеш external сообщения base64'
    })}: <code>{result.hashBase64}</code></Paragraph>
    <Paragraph>{t({
      en:'External message hash (hex)',
      ru:'Хеш external сообщения hex',
    })}: <code>{result.hashHex}</code></Paragraph>
    <Paragraph>{t({
      en:'External message BoC (base64)',
      ru:'BoC external сообщения base64',
    })}: <pre>{result.boc}</pre></Paragraph>
  </Card>
}

export default ResultAlert
