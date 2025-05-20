import { TemplateType } from "@/templates/type";
import { useCallback, useRef, useState } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useRouter } from "next/router";


export function useTemplateFormControl(t: TemplateType) {
  const [loading, setLoading] = useState(false)
  const lRef = useRef(false)
  const router = useRouter();
  const nextSubmitIsExport = useRef(false)
  const [ result, setResult ] = useState<null | string>(null);
  const [ tonConnectUI ] = useTonConnectUI();
  const [ error, setError ] = useState<null | unknown>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = useCallback((inputPayload?:any) => {
    if (lRef.current) return
    lRef.current = true
    setLoading(true)
    setResult(null)
    setError(null)
    t.toTx(inputPayload ?? {})
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
          const res = await tonConnectUI.sendTransaction(tx, { modals: [ 'before' ] })
          setResult(res.boc)
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
