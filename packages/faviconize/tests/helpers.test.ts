import * as path from 'path'
import fs from 'fs/promises'
import { vol as memoryFsVolume } from 'memfs'

import { IconType, InputFileError } from '../src/types'
import {
  resolveAndCreateOrUseOutputPath,
  normalizeOutputTypes,
  resolveAndCheckInputFilePath,
  forEachIconTypeEdgeIncludes,
  isValidHexColorString,
} from '../src/helpers'
import { defaultOutputDirectory, iconTypesAndEdgesMap } from '../src/constants'

jest.mock('fs/promises')

describe(normalizeOutputTypes, () => {
  it('should throw an error if an empty array is provided', () => {
    expect(() => normalizeOutputTypes([])).toThrow()
  })

  it('should return a set with default icon output types if no output types or null is provided', () => {
    const outputTypes = normalizeOutputTypes(null)
    const defaultIconTypes = new Set(Object.keys(iconTypesAndEdgesMap) as Array<IconType>)

    expect(outputTypes).toStrictEqual(defaultIconTypes)
  })

  it('should return a set with a single icon output type', () => {
    const outputTypes = normalizeOutputTypes(['icon'])

    expect(outputTypes).toStrictEqual<Set<IconType>>(new Set(['icon']))
  })

  it('should return a set with multiple icon output types', () => {
    const outputTypes = normalizeOutputTypes(['icon', 'apple-touch-icon'])

    expect(outputTypes).toStrictEqual<Set<IconType>>(new Set(['icon', 'apple-touch-icon']))
  })

  // Do we need this?
  it('should return a set with no duplicates if there are any provided', () => {
    const outputTypes = normalizeOutputTypes(['icon', 'apple-touch-icon', 'apple-touch-icon'])

    expect(outputTypes).toStrictEqual<Set<IconType>>(new Set(['icon', 'apple-touch-icon']))
  })

  it('should return a set with one item if single icon type is provided', () => {
    const outputTypes = normalizeOutputTypes('icon')

    expect(outputTypes).toStrictEqual<Set<IconType>>(new Set(['icon']))
  })
})

describe(resolveAndCreateOrUseOutputPath, () => {
  afterEach(() => {
    memoryFsVolume.reset()
  })

  it('should resolve default relative path and create non-existent directory with default path if no path is provided', async () => {
    const outputPath = await resolveAndCreateOrUseOutputPath()

    await expect(fs.stat(outputPath)).resolves.not.toThrow()
    expect(outputPath).toEqual(path.resolve(defaultOutputDirectory))
  })

  it('should resolve relative path and create non-existent directory with provided relative path', async () => {
    const fakeRelativeOutputPath = './test-relative-directory'

    const outputPath = await resolveAndCreateOrUseOutputPath(fakeRelativeOutputPath)

    await expect(fs.stat(outputPath)).resolves.not.toThrow()
    expect(outputPath).toEqual(path.resolve(fakeRelativeOutputPath))
  })

  it('should resolve absolute path and create non-existent directory with provided absolute path', async () => {
    const currentWorkingDirectory = process.cwd()
    const fakeAbsoluteOutputPath = path.join(currentWorkingDirectory, 'test-absolute-directory')

    const outputPath = await resolveAndCreateOrUseOutputPath(fakeAbsoluteOutputPath)

    await expect(fs.stat(outputPath)).resolves.not.toThrow()
    expect(outputPath).toEqual(fakeAbsoluteOutputPath)
  })
})

describe(resolveAndCheckInputFilePath, () => {
  afterEach(() => {
    memoryFsVolume.reset()
  })

  it('should resolve relative path and pass input file existence check', async () => {
    const fakeRelativeInputFilePath = './test-relative-file'
    memoryFsVolume.fromJSON({ [fakeRelativeInputFilePath]: 'test-file-content' })

    const futureInputFilePath = resolveAndCheckInputFilePath(fakeRelativeInputFilePath)

    await expect(futureInputFilePath).resolves.not.toThrow()
    await expect(futureInputFilePath).resolves.toEqual(path.resolve(fakeRelativeInputFilePath))
  })

  it('should resolve absolute path and pass input file existence check', async () => {
    const currentWorkingDirectory = process.cwd()
    const fakeAbsoluteInputFilePath = path.join(currentWorkingDirectory, 'test-absolute-file')
    memoryFsVolume.fromJSON({ [fakeAbsoluteInputFilePath]: 'test-file-content' })

    const futureInputFilePath = resolveAndCheckInputFilePath(fakeAbsoluteInputFilePath)

    await expect(futureInputFilePath).resolves.not.toThrow()
    await expect(futureInputFilePath).resolves.toEqual(path.resolve(fakeAbsoluteInputFilePath))
  })

  it('should throw an error if input file does not exist', async () => {
    const fakeRelativeInputFilePath = './test-relative-non-existent-file'

    const futureInputFilePath = resolveAndCheckInputFilePath(fakeRelativeInputFilePath)

    await expect(futureInputFilePath).rejects.toThrowError(new InputFileError('does-not-exist'))
  })

  it('should throw an error if input file is a directory', async () => {
    const fakeRelativeInputFilePath = './test-relative-directory'
    memoryFsVolume.fromJSON({ [fakeRelativeInputFilePath]: null })

    const futureInputFilePath = resolveAndCheckInputFilePath(fakeRelativeInputFilePath)

    await expect(futureInputFilePath).rejects.toThrow(new InputFileError('is-a-directory'))
  })
})

describe(forEachIconTypeEdgeIncludes, () => {
  it('should iterate over all icon types and edges', async () => {
    const uniqueIconTypes = new Set(Object.keys(iconTypesAndEdgesMap) as Array<IconType>)
    const expectedCalls = Object.values(iconTypesAndEdgesMap).flat().length
    const spyFn = jest.fn()

    await forEachIconTypeEdgeIncludes(uniqueIconTypes, spyFn)
    expect(spyFn).toHaveBeenCalledTimes(expectedCalls)
  })
})

describe(isValidHexColorString, () => {
  it('should return true for 6 digits hex color', () => {
    expect(isValidHexColorString('#000000')).toBeTruthy()
  })

  it('should return true for 3 digits hex color', () => {
    expect(isValidHexColorString('#000')).toBeTruthy()
  })

  it('should return false for HTML color literal', () => {
    expect(isValidHexColorString('blue')).toBeFalsy()
  })

  it('should return false for hex color with too much digits', () => {
    expect(isValidHexColorString('#000000000')).toBeFalsy()
  })

  it('should return false for hex color with too few digits', () => {
    expect(isValidHexColorString('#00000')).toBeFalsy()
  })

  it('should return false if there is no # while rest of the color is valid', () => {
    expect(isValidHexColorString('000000')).toBeFalsy()
  })
})
