import React, { useMemo } from "react";
import { Cell } from "@ton/core";
import { Typography, Card } from "antd";
const {Link,Paragraph} = Typography


const ResultAlert: React.FC<{ boc: string }> = ({ boc }) => {
  const result = useMemo(() => {
    const txHash = Cell.fromBase64(boc).hash()
    const txUrl = `https://tonviewer.com/transaction/${txHash.toString('hex')}`
    return {
      url: txUrl,
      hashBase64: txHash.toString('base64'),
      hashHex: txHash.toString('hex'),
      boc: boc,
    }
  }, [ boc ])



  return <Card size="small" title="Transaction sent!">
    <Paragraph>Link: <Link href={result.url} target='_blank'>{result.url}</Link></Paragraph>
    <Paragraph>external hash base64: <code>{result.hashBase64}</code></Paragraph>
    <Paragraph>external hash hex: <code>{result.hashHex}</code></Paragraph>
    <Paragraph>external boc: <pre>{result.boc}</pre></Paragraph>
  </Card>
}

export default ResultAlert
