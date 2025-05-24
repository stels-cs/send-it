
export function getLang(): 'ru'|'en' {
  if (typeof window === 'undefined') {
    return 'en'
  }
  if (window.navigator.languages.find(x => x.startsWith('ru'))) {
    return  'ru'
  } else {
    return 'en'
  }
}

export function t(l:{en:string, ru?:string}):string {
  if (!l.ru) return l.en
  const ttt = l[getLang()]
  return ttt ?? l.en
}
