import React, { ReactNode } from 'react'
import * as ansiColors from 'ansi-colors'
import { Transform } from 'ink'
import gradientString from 'gradient-string'

interface LabelProps {
  bold?: boolean
  children: ReactNode
}

const gradient = ['#FEAC5E', '#C779D0', '#4BC0C8']

export const Label = ({ children, bold }: LabelProps) => {
  return (
    <Transform
      transform={(value: string) =>
        bold ? ansiColors.bold(gradientString(...gradient)(value)) : gradientString(...gradient)(value)
      }
    >
      {children}
    </Transform>
  )
}
