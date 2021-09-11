import * as path from 'path'
import sharp from 'sharp'

import {
  normalizeOutputTypes,
  resolveAndCreateOrUseOutputPath,
  resolveAndCheckInputFilePath,
  forEachIconTypeEdgeIncludes,
  isValidHexColorString,
  arrayInsertAt,
} from './helpers'
import { IconType } from './types'

/**
 * Generate favicons in various formats from image.
 * @param  {string} imageInput File from which icons will be generated. Can be path to input file or buffer.
 * @param  {IconType | Array<IconType>} outputIconTypes Icon types to be generated. Can be a single type or an array of types. null means all types.
 * @param  {string} outputDirectoryPath Directory where to save icons. If not specified it will be `icons/`
 */
export async function faviconize(
  imageInput: string | Buffer,
  outputIconTypes?: IconType | Array<IconType>,
  outputDirectoryPath?: string,
) {
  const resolvedImageInput = Buffer.isBuffer(imageInput) ? imageInput : await resolveAndCheckInputFilePath(imageInput)
  const normalizedOutputTypes = normalizeOutputTypes(outputIconTypes)
  const resolvedOutputDirectoryPath = await resolveAndCreateOrUseOutputPath(outputDirectoryPath)

  await forEachIconTypeEdgeIncludes(normalizedOutputTypes, async (type, edge) => {
    const size = [edge, edge]

    const outputFileName =
      type === 'msapplication-square[size]logo'
        ? `${arrayInsertAt(type.split('[size]'), 1, size.join('x')).join("")}.png`
        : `${type}-${size.join('x')}.png`

    const outputFileAbsolutePath = path.join(resolvedOutputDirectoryPath, outputFileName)

    await sharp(resolvedImageInput)
      .resize(...size)
      .toFile(outputFileAbsolutePath)
  })
}

/**
 * Generate embeddable favicons link tags.
 * @param  {IconType | Array<IconType>} outputIconTypes Icon types for whose link tags will be generated. Can be a single type or an array of types. null means all types.
 * @param  {string} tileColor Optional HEX (`#rrggbb` or `#rgb`) string representing the color of the tile in Microsoft specific integrations.
 */
export async function generateIconsLinkTags(outputIconTypes?: IconType | Array<IconType>, tileColor?: string) {
  const normalizedOutputTypes = normalizeOutputTypes(outputIconTypes)
  const linkTags: Array<string> = []

  if (tileColor) {
    if (!isValidHexColorString(tileColor)) {
      throw new Error(`Provided tile color (${tileColor}) is not valid hex color string.`)
    }

    linkTags.push(`<meta name="msapplication-TileColor" content="${tileColor}">`)
  }

  await forEachIconTypeEdgeIncludes(normalizedOutputTypes, (type, edge) => {
    const size = [edge, edge]

    const fileName =
      type === 'msapplication-square[size]logo'
        ? `${arrayInsertAt(type.split('[size]'), 1, size.join('x')).join("")}.png`
        : `${type}-${size.join('x')}.png`

    const filePath = path.join('icons', fileName)

    if (type === 'msapplication-square[size]logo') {
      linkTags.push(`<meta name="msapplication-square${size.join('x')}logo" content="${filePath}">`)
      return
    }

    linkTags.push(`<link rel="${type}" type="image/png" href="${filePath}" sizes="${size.join('x')}">`)
  })

  return linkTags
}
