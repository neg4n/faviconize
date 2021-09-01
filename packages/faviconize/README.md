<div align="center">
  <h1>faviconize</h1>
  <h4>Library and CLI for generating favicons in all formats</h4>
  <br />
</div>

## Motivation

I _(neg4n)_ wanted to create simpler and more intuitive replacement
for existing project with the same purpose - [Real Favicon Generator](https://realfavicongenerator.net).
RFG is really good project but sadly it works only online, its [API](https://github.com/RealFaviconGenerator/rfg-api) for Node.js makes HTTP requests under the hood instead of working locally and whole generator seems a little bit overcomplicated for me, personally.

## Getting started

**faviconize** repository is a CLI application and a library source at once.

### Installing CLI globally

```shell
npm i faviconize-cli -g
```

or if you want limit scope to the project

```shell
npm i faviconize-cli -D
```

### Installing the library

```shell
npm i faviconize-cli -S

```

_You will probably want to install it as devDependency :D_

## Usage

### Command line

```
faviconize <image-to-resize>
```
then follow self-explanatory terminal user interface.

### Code

```js
import { faviconize } from 'faviconize'

async function run() {
  await faviconize('path/to/image.jpg')
  // ... or with custom output icon types
  await faviconize('path/to/other-image.jpg', [
    'apple-touch-icon',
    'msapplication-TileImage',
  ])
  // ... or with all icon types and custom output directory
  await faviconize('path/to/another-image.jpg', null, '.')
}

run()
```

## TODO

- [ ] `example/` project
- [ ] Documentation
- [ ] Configuration
- [ ] Tests

## Ending speech

This project is licensed under the MIT license.
All contributions are welcome.