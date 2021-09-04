import React, { useEffect, useState } from 'react'
import { Box, Text, useFocusManager, useInput } from 'ink'
import { IconType } from 'faviconize/dist/types'

import { Label } from './Label'
import { iconTypesAndEdgesMap } from 'faviconize/dist/constants'

type OutputTypesMultiselectProps = {
  onSubmit: (outputTypes: IconType[]) => void
}

type TogglableIconType = { [key in IconType]: boolean }

function mapIconTypesToBoolHashMap(iconTypes: IconType[]) {
  return Object.fromEntries(iconTypes.map((iconType) => [iconType, true])) as TogglableIconType
}

export function OutputTypesMultiselect({ onSubmit }: OutputTypesMultiselectProps) {
  const { enableFocus, focusNext, focusPrevious } = useFocusManager()
  const [cursor, setCursor] = useState(0)

  const [outputTypes, setOutputTypes] = useState<TogglableIconType>(
    mapIconTypesToBoolHashMap(Object.keys(iconTypesAndEdgesMap) as IconType[]),
  )

  useInput((input, key) => {
    if (key.downArrow) {
      setCursor(cursor === 2 ? 0 : cursor + 1)
      focusNext()
    }

    if (key.upArrow) {
      setCursor(cursor === 0 ? 2 : cursor - 1)
      focusPrevious()
    }

    if (input === ' ') {
      const outputTypesCopy = [...Object.entries(outputTypes)]
      const newOutputType = [...outputTypesCopy[cursor]]

      newOutputType[1] = !newOutputType[1]
      outputTypesCopy[cursor] = newOutputType as [IconType, boolean]

      setOutputTypes(Object.fromEntries(outputTypesCopy) as TogglableIconType)
    }

    if (key.return) {
      onSubmit(Object.keys(outputTypes).filter((iconType) => outputTypes[iconType as IconType]) as IconType[])
    }
  })

  return (
    <Box flexDirection="column">
      <Box>
        <Label bold>Select output types</Label>
        <Box marginLeft={1}>
          <Text color="blackBright">(up/down = move, space = toggle, enter = submit)</Text>
        </Box>
        <Text>:</Text>
      </Box>
      {Object.entries(outputTypes).map(([iconType, isSelected], index) => {
        const isCurrentlyFocused = index === cursor
        return (
          <Box key={iconType}>
            <Box marginRight={1} />
            {<Text {...(isSelected && { color: 'greenBright' })}>{isSelected ? '●' : '◯'}</Text>}
            <Box marginRight={1} />

            {isCurrentlyFocused && <Label bold>{iconType}</Label>}
            {!isCurrentlyFocused && <Text>{iconType}</Text>}
          </Box>
        )
      })}
    </Box>
  )
}
