export type IconType = 'icon' | 'msapplication-TileImage' | 'apple-touch-icon'

export type IconTypeAndEdges = {
  [key in IconType]: number[]
}

export class InputFileError extends Error {
  constructor(private readonly inputFileErrorType: InputFileErrorType) {
    super(inputFileErrorMessages[inputFileErrorType])
    Object.setPrototypeOf(this, InputFileError.prototype)
  }
}

type InputFileErrorType = 'is-a-directory' | 'does-not-exist'

const inputFileErrorMessages: { [key in InputFileErrorType]: string } = {
  'does-not-exist': 'Input file does not exist.',
  'is-a-directory': 'Input file must not be a directory.',
}
