import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

export function useShareAndRestoreData(templateId:string) {
  const router = useRouter();
  const preloadData = useMemo(() => {
    const q = router.query;
    const input: Record<string, string> = {}
    Object.entries(q).forEach(([name, value]) => {
      if (value && typeof value === 'string' && name.startsWith('f_')) {
        input[name.replace('f_','')] = value
      }
    })
    return input
  }, [router])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generateMemoLink = useCallback((formData:any) => {
    if (formData && typeof formData === 'object') {
      const u = new URL(location.href)
      for(const [key] of u.searchParams.entries()) {
        u.searchParams.delete(key)
      }
      u.searchParams.set('name', templateId)
      Object.entries(formData).forEach(([key,value]) => {
        if (value && (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint')) {
          u.searchParams.set(`f_${key}`, value.toString())
        }
      })
      return u.toString()
    }
    return null
  }, [templateId])

  return {
    preloadData,
    generateMemoLink
  }
}
