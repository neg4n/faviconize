import React, { useContext, useReducer, createContext, Dispatch } from 'react'
import { IconType } from 'faviconize/dist/types'

export type CompletedStepType = 'outputDirectoryPath' | 'outputTypes'

type CompletedStepValueType = string | IconType | IconType[]

type CompletedStepActionTypeType /* :D */ = 'SET_OUTPUT_DIRECTORY_PATH' | 'SET_OUTPUT_TYPES'
type CompletedStepActionType = { type: CompletedStepActionTypeType; payload: CompletedStepValueType }

type CompletedStepsContextType = {
  [key in CompletedStepType]: CompletedStepValueType
}

export const completedStepHumanReadableNames: { [key in CompletedStepType]: string } = {
  outputDirectoryPath: 'Output directory path',
  outputTypes: 'Output types',
}

const defaultCompletedStepsContextValue: CompletedStepsContextType = {
  outputDirectoryPath: null,
  outputTypes: null,
}

const CompletedStepsStateContext = createContext<CompletedStepsContextType>(defaultCompletedStepsContextValue)
const CompletedStepsDispatchContext = createContext<Dispatch<CompletedStepActionType>>(null)

function completedStepsReducer(state: CompletedStepsContextType, action: CompletedStepActionType) {
  switch (action.type) {
    case 'SET_OUTPUT_DIRECTORY_PATH':
      return {
        ...state,
        outputDirectoryPath: action.payload,
      }
    case 'SET_OUTPUT_TYPES':
      return {
        ...state,
        outputTypes: action.payload,
      }
    default:
      return state
  }
}

interface CompletedStepsProviderProps {
  children: React.ReactNode
}

export function CompletedStepsProvider({ children }: CompletedStepsProviderProps) {
  const [state, dispatch] = useReducer(completedStepsReducer, defaultCompletedStepsContextValue)
  return (
    <CompletedStepsStateContext.Provider value={state}>
      <CompletedStepsDispatchContext.Provider value={dispatch}>{children}</CompletedStepsDispatchContext.Provider>
    </CompletedStepsStateContext.Provider>
  )
}

export function useCompletedStepsState() {
  const state = useContext(CompletedStepsStateContext)

  return state
}

export function useCompletedStepsDispatch() {
  const dispatch = useContext(CompletedStepsDispatchContext)

  return dispatch
}
