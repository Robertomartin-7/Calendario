import { useEffect, useState } from 'react'
import { DEFAULT_HEADER } from '../components/Header'
import { subscribeSettings } from '../firebase/db'

export function useSettings(uid: string) {
  const [headerText, setHeaderText] = useState(DEFAULT_HEADER)
  useEffect(() => subscribeSettings(uid, (s) => setHeaderText(s.headerText || DEFAULT_HEADER)), [uid])
  return { headerText }
}
