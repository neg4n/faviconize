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

**faviconize** repository contains both CLI application and library source.

### Installing the library

```shell
npm i faviconize-cli -S

```

_You will probably want to install it as devDependency :D_

### Installing CLI globally

_Work in progress_

## Usage

### Command line

_Work in progress_

### Code

```js
import { faviconize } from 'faviconize'

async function run() {
  await faviconize('path/to/image.jpg')
  // ... or with custom output icon types
  await faviconize('path/to/other-image.jpg', ['apple-touch-icon', 'msapplication-TileImage'])
  // ... or with all icon types and custom output directory
  await faviconize('path/to/another-image.jpg', null, '.')
}

run()
```

## Ending speech

This project is licensed under the MIT license.
All contributions are welcome.
