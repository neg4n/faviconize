import * as path from 'path'
import * as fs from 'fs/promises'

import { defaultOutputDirectory, iconTypesAndEdgesMap } from './constants'
import { IconType, InputFileError } from './types'

export function normalizeOutputTypes(outputTypes: IconType | IconType[]): IconType[] {
  if (outputTypes) {
    if (outputTypes instanceof Array) {
      if (outputTypes.length === 0) {
        throw new Error('Output types must be an array of at least one element')
      }
      return outputTypes.filter((type, index, original) => original.indexOf(type) === index)
    } else {
      return [outputTypes]
    }
  } else {
    return Object.keys(iconTypesAndEdgesMap) as IconType[]
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
