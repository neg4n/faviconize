import { faviconize, generateIconsLinkTags } from '../src/faviconize'

describe(faviconize, () => {
  it('is a function', async () => {
    console.log(await generateIconsLinkTags(null, '#cccccc'))
    expect(typeof faviconize).toBe('function')
  })
})
