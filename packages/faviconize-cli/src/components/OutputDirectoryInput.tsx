import React, { useState } from 'react'
import { Text, Box } from 'ink'
import TextInput from 'ink-text-input'
import { defaultOutputDirectory } from 'faviconize/dist/constants'

import { Label } from './Label'

type OutputDirectoryInputProps = {
  onSubmit: (outputDirectory: string) => void
}

export function OutputDirectoryInput({ onSubmit }: OutputDirectoryInputProps) {
  const [outputDirectoryPath, setOutputDirectoryPath] = useState(defaultOutputDirectory)

  const handleChangeOutputPath = (value: string) => {
    setOutputDirectoryPath(value)
  }

  return (
    <Box>
      <Box marginRight={1}>
        <Label bold>Specify output directory path</Label>
        {outputDirectoryPath === defaultOutputDirectory && (
          <Box marginLeft={1}>
            <Text color="blackBright">(default: {outputDirectoryPath})</Text>
          </Box>
        )}
        <Text>:</Text>
      </Box>
      <TextInput
        value={outputDirectoryPath === defaultOutputDirectory ? '' : outputDirectoryPath}
        onChange={handleChangeOutputPath}
        onSubmit={() => onSubmit(outputDirectoryPath)}
      />
    </Box>
  )
}
