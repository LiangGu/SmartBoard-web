import { useState, useCallback } from 'react'
export default function global() {
  const [user, settest] = useState(0)
 
  const test1 = useCallback(() => {
    settest(1)
  }, [])
  const test2 = useCallback(() => {
    settest(2)
  }, [])
  return {
    user,
    test1,
    test2
  }
}