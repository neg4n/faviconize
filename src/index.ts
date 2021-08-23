#!/usr/bin/env node

import * as path from 'path'
import { access, mkdir } from 'fs/promises'
import chalk from 'chalk'
import * as sharp from 'sharp'
import * as inquirer from 'inquirer'

type IconType = 'icon' | 'msapplication-TileImage' | 'apple-touch-icon'

const ICON_TYPE_SIZE = {
  icon: [196, 160, 96, 32, 16],
  'msapplication-TileImage': [70, 150, 310],
  'apple-touch-icon': [57, 144, 72, 144, 60, 120, 76, 152],
}

/**
 * Generate favicons in various formats from image.
 * @param  {string} inputFilePath File from which icons will be generated.
 * @param  {IconType | IconType[]} outputTypes Icon types to be generated. Can be a single type or an array of types. null means all types.
 * @param  {string} outputDirectory Directory where to save icons. If not specified it will be `icons/`
 */
export async function faviconize(
  inputFilePath: string,
  outputTypes?: IconType | IconType[],
  outputDirectory?: string,
) {
  const types = normalizeOutputTypes()
  const currentDirectory = path.join(process.cwd())
  const outputPath = await createOrUseOutputPath()

  for (const [type, edgeSizes] of Object.entries(ICON_TYPE_SIZE)) {
    if (types.includes(type)) {
      for (const edge of edgeSizes) {
        const size = [edge, edge]

        const inputPath = path.resolve(path.join(currentDirectory, inputFilePath))
        const outputFile = path.join(outputPath, `${type}-${size.join('x')}.png`)

        sharp(inputPath)
          .resize(...size)
          .toFile(outputFile)
      }
    }
  }

  function normalizeOutputTypes() {
    if (outputTypes) {
      if (outputTypes instanceof Array) {
        return outputTypes.filter(
          (type, index, original) => original.indexOf(type) === index,
        )
      } else {
        return [outputTypes]
      }
    } else {
      return Object.keys(ICON_TYPE_SIZE)
    }
  }

  async function createOrUseOutputPath() {
    const outputPath = path.resolve(
      path.join(currentDirectory, outputDirectory || 'icons/'),
    )

    try {
      await access(outputPath)
    } catch (error) {
      await mkdir(outputPath)
    }

    return outputPath
  }
}

async function cli() {
  const args = process.argv.slice(2, process.argv.length)
  if (args.length !== 1) {
    const { bgBlack, bold, red, underline, gray, white } = chalk
    console.log()
    console.log(bgBlack(bold(red(` CLI Error: Incorrect number of arguments `))))
    console.log(`${gray('Usage:')} faviconize <path-to-image>`)
    console.log()
    console.log(
      `Find out more at ${white(
        underline('https://github.com/neg4n/faviconize#readme'),
      )}`,
    )
    console.log()
    process.exit(1)
  }

  const [inputPath] = args
  const { outputTypes, outputDirectory } = await cliInterface()

  faviconize(inputPath, outputTypes, outputDirectory)

  async function cliInterface(): Promise<{
    outputTypes: IconType[]
    outputDirectory: string
  }> {
    try {
      return await inquirer.prompt([
        {
          name: 'outputTypes',
          message: 'Choose output icon types:',
          type: 'checkbox',
          default: Object.keys(ICON_TYPE_SIZE),
          choices: Object.keys(ICON_TYPE_SIZE),
        },
        {
          name: 'outputDirectory',
          message: 'Choose output directory:',
          type: 'input',
          default: 'icons/',
        },
      ])
    } catch (error) {
      console.error(error)
    }
  }
}

cli()
