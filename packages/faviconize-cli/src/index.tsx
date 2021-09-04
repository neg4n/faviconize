#!/usr/bin/env node

import React, { useEffect, useState } from 'react'
import firstRun from 'first-run'
import { render, Text, useApp, Box, Newline } from 'ink'
import { faviconize } from 'faviconize'
import { IconType } from 'faviconize/dist/types'

import { useInputPath } from './hooks/use-input-path'
import { Form } from './components/Form'
import {
  completedStepHumanReadableNames,
  CompletedStepsProvider,
  CompletedStepType,
  useCompletedStepsState,
} from './context/completed-steps'
import { Label } from './components/Label'

firstRun.clear()
const isFirstRun = firstRun()

function Cli() {
  const { exit } = useApp()
  const { inputPath, isError: isInputPathError } = useInputPath()

  useEffect(() => {
    if (isInputPathError) {
      exit(new Error('Invalid number of arguments'))
    }
  }, [isInputPathError])

  if (isInputPathError) {
    return <Text color="red">CLI Error: Incorrect number of arguments</Text>
  }

  return (
    <CompletedStepsProvider>
      {isFirstRun && (
        <Box flexDirection="column" borderStyle="double" borderColor="blackBright" paddingX={1}>
          <Box marginBottom={1}>
            <Text>
              Hey! You are using <Label bold>faviconize-cli</Label> for the first time!
            </Text>
          </Box>
          <Text>
            - Check out the repository <Text underline>https://github.com/neg4n/faviconize</Text>
          </Text>
          <Text>
            - Open an issue if you have any questions or problems{' '}
            <Text underline>https://github.com/neg4n/faviconize/issues</Text>
          </Text>
          <Box marginTop={1}>
            <Text>All contributions are welcome.</Text>
          </Box>
          <Box marginTop={1}>
            <Text color="blackBright" italic>
              NOTE: You won't see this message next time
            </Text>
          </Box>
        </Box>
      )}
      <CliLayout inputPath={inputPath} />
    </CompletedStepsProvider>
  )
}

type CliLayoutProps = {
  inputPath: string
}

function CliLayout({ inputPath }: CliLayoutProps) {
  const { exit } = useApp()
  const state = useCompletedStepsState()
  const [hasGenerated, setHasGenerated] = useState(null)

  const handleFormSubmit = async () => {
    setHasGenerated(false)
    await faviconize(inputPath, state.outputTypes as IconType[], state.outputDirectoryPath as string)
    setHasGenerated(true)
    exit()
  }

  return (
    <>
      <Box flexDirection="column">
        {Object.entries(state)
          .filter(([, value]) => value)
          .map((element) => {
            const [step, stepValue] = element
            return (
              <Box key={step}>
                <Box marginRight={1}>
                  <Text color="greenBright" bold>
                    ?
                  </Text>
                </Box>
                <Text bold color="whiteBright">
                  {completedStepHumanReadableNames[step as CompletedStepType]}
                </Text>
                <Text>:</Text>
                <Box marginRight={1} />
                <Text color="white">{Array.isArray(stepValue) ? stepValue.join(', ') : stepValue}</Text>
              </Box>
            )
          })}
      </Box>
      <Form onSubmit={handleFormSubmit} />
      {hasGenerated === false && hasGenerated !== null && <Text>Generating icons...</Text>}
      {hasGenerated && <Label bold>Generated all icons!</Label>}
    </>
  )
}

render(<Cli />)
