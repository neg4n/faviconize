import * as path from 'path'
import { useState, useEffect } from 'react'

export function useInputPath() {
  const [inputPath, setInputPath] = useState('')
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const args = process.argv.slice(2, process.argv.length)

    if (args.length !== 1) {
      setIsError(true)
      return
    }

    const [inputPathFromArgs] = args
    setInputPath(path.resolve(inputPathFromArgs))
  }, [])

  return {
    inputPath,
    isError,
  }
}
