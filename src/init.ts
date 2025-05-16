

export function createDefaultTransactionPayload(queryInput: string[]|string|undefined) {
  if (typeof queryInput === 'string') {
    try {
      const data = JSON.parse(queryInput);
      return {
        payload: JSON.stringify(data, null, 2),
      }
    }catch (e){
      console.error(`Failed parse`, e, queryInput)
    }
  }

  return {
    payload: JSON.stringify({
      validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
      messages: [
        {
          address: "UQB5HQfjevz9su4ZQGcDT_4IB0IUGh5PM2vAXPU2e4O6_YBm", // message destination in user-friendly format
          amount: "20000000", // Toncoin in nanotons
        },
      ],
    }, null, 2)
  }
}


export function exportFormData(data:string) {
  const u = new URL(location.href)
  u.searchParams.set('tx', data)
  return u.toString()
}
