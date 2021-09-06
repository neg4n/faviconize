import * as path from 'path'
import fs from 'fs/promises'

import { defaultOutputDirectory, iconTypesAndEdgesMap } from './constants'
import { IconType, InputFileError } from './types'

export function normalizeOutputTypes(outputTypes: IconType | Array<IconType>): Set<IconType> {
  if (outputTypes) {
    if (outputTypes instanceof Array) {
      if (outputTypes.length === 0) {
        throw new Error('Output types must be an array of at least one element')
      }
      return new Set(outputTypes)
    } else {
      return new Set([outputTypes])
    }
  } else {
    return new Set(Object.keys(iconTypesAndEdgesMap) as Array<IconType>)
  }
}

export async function resolveAndCreateOrUseOutputPath(outputDirectoryPath?: string) {
  const resolvedOutputdirectoryPath = path.resolve(outputDirectoryPath || defaultOutputDirectory)

  try {
    await fs.stat(resolvedOutputdirectoryPath)
  } catch (error) {
    await fs.mkdir(resolvedOutputdirectoryPath, { recursive: true })
  }
  return resolvedOutputdirectoryPath
}

export async function resolveAndCheckInputFilePath(inputFilePath: string) {
  const resolvedInputFilePath = path.resolve(inputFilePath)
  try {
    const inputFileStat = await fs.stat(resolvedInputFilePath)
    if (inputFileStat.isDirectory()) {
      throw new InputFileError('is-a-directory')
    }
  } catch (error) {
    if (error.code) {
      throw new InputFileError('does-not-exist')
    }
    throw error
  }
  return resolvedInputFilePath
}
