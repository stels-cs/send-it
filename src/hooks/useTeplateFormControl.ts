import { TemplateType } from "@/templates/type";
import { useCallback, useRef, useState } from "react";
import { CHAIN, useTonConnectUI } from "@tonconnect/ui-react";
import { useRouter } from "next/router";
import { Address } from "@ton/core";


export function useTemplateFormControl(t: TemplateType) {
  const [loading, setLoading] = useState(false)
  const lRef = useRef(false)
  const router = useRouter();
  const nextSubmitIsExport = useRef(false)
  const [ result, setResult ] = useState<null | {boc:string, ui?:{text:string, link?:string}}>(null);
  const [ tonConnectUI ] = useTonConnectUI();
  const [ error, setError ] = useState<null | unknown>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = useCallback((inputPayload?:any) => {
    if (lRef.current) return
    lRef.current = true
    setLoading(true)
    setResult(null)
    setError(null)

    const testOnly = tonConnectUI.account?.chain === CHAIN.TESTNET

    function tonAddressFormat(address: Address, bounceable: boolean) {
      return address.toString({
        testOnly,
        bounceable,
      })
    }

    function addressInExplorer(address: Address, bounceable: boolean) {
      const a = tonAddressFormat(address, bounceable);
      return testOnly ? `https://testnet.tonviewer.com/${a}`
        : `https://tonviewer.com/${a}`
    }

    t.toTx(inputPayload ?? {}, {tonAddressFormat, addressInExplorer})
      .then(async tx => {
        if (nextSubmitIsExport.current) {
          nextSubmitIsExport.current = false
          await router.push({
            pathname: '/',
            query: {
              tx: JSON.stringify(tx)
            }
          })
        } else {
          const res = await tonConnectUI.sendTransaction(tx.tx, { modals: [ 'before' ] })
          setResult({
            boc: res.boc,
            ui: tx.ui,
          })
        }
      })
      .catch(e => {
        setError(e);
      })
      .finally(() => {
        setLoading(false)
        lRef.current = false
        nextSubmitIsExport.current = false
      })
  }, [router, t, tonConnectUI])

  const onExportCLick = useCallback(() => {
    nextSubmitIsExport.current = true
  }, [nextSubmitIsExport])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    loading,
    onSubmit,
    onExportCLick,
    result,
    error,
    clearError,
  }
}
