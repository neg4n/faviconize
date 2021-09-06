import * as path from 'path'
import sharp from 'sharp'

import { iconTypesAndEdgesMap } from './constants'
import { normalizeOutputTypes, resolveAndCreateOrUseOutputPath, resolveAndCheckInputFilePath } from './helpers'
import { IconType } from './types'

/**
 * Generate favicons in various formats from image.
 * @param  {string} imageInput File from which icons will be generated. Can be path to input file or buffer.
 * @param  {IconType | IconType[]} outputTypes Icon types to be generated. Can be a single type or an array of types. null means all types.
 * @param  {string} outputDirectoryPath Directory where to save icons. If not specified it will be `icons/`
 */
export async function faviconize(
  imageInput: string | Buffer,
  outputTypes?: IconType | Array<IconType>,
  outputDirectoryPath?: string,
) {
  const resolvedImageInput = Buffer.isBuffer(imageInput) ? imageInput : await resolveAndCheckInputFilePath(imageInput)
  const normalizedOutputTypes = normalizeOutputTypes(outputTypes)
  const resolvedOutputPath = await resolveAndCreateOrUseOutputPath(outputDirectoryPath)

  for (const [type, edges] of Object.entries(iconTypesAndEdgesMap)) {
    if (normalizedOutputTypes.has(type as IconType)) {
      try {
        await Promise.all(
          edges.map((edge) => {
            const size = [edge, edge]
            const outputFileAbsolutePath = path.join(resolvedOutputPath, `${type}-${size.join('x')}.png`)
            return sharp(resolvedImageInput)
              .resize(...size)
              .toFile(outputFileAbsolutePath)
          }),
        )
      } catch (error) {
        console.error(error)
      }
    }
  }
}
