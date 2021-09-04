import React, { useEffect, useState } from 'react'
import { Box } from 'ink'
import { IconType } from 'faviconize/dist/types'

import { useCompletedStepsDispatch, useCompletedStepsState } from '../context/completed-steps'
import { OutputDirectoryInput } from './OutputDirectoryInput'
import { OutputTypesMultiselect } from './OutputTypesMultiselect'

type FormProps = {
  onSubmit: () => void
}

type FormStateType = 'select-output-types' | 'set-output-path' | 'finish'

export function Form({ onSubmit }: FormProps) {
  const dispatch = useCompletedStepsDispatch()
  const [formState, setFormState] = useState<FormStateType>('set-output-path')

  useEffect(() => {
    if (formState === 'finish') {
      onSubmit()
    }
  }, [formState])

  const handleOutputDirectorySubmit = (outputDirectory: string) => {
    dispatch({ type: 'SET_OUTPUT_DIRECTORY_PATH', payload: outputDirectory })
    setFormState('select-output-types')
  }

  const handleOutputTypesSubmit = (outputTypes: IconType[]) => {
    dispatch({
      type: 'SET_OUTPUT_TYPES',
      payload: outputTypes,
    })
    setFormState('finish')
  }

  return (
    <>
      {formState === 'set-output-path' && <OutputDirectoryInput onSubmit={handleOutputDirectorySubmit} />}
      {formState === 'select-output-types' && <OutputTypesMultiselect onSubmit={handleOutputTypesSubmit} />}
      {formState === 'finish' && <Box />}
    </>
  )
}
