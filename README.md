# Vue Color Wheel

[![NPM][npmBadge]][npmUrl]
[![Minzip Package][bundlePhobiaBadge]][bundlePhobiaUrl]
[![NPM Download][npmDtBadge]][npmDtUrl]

[npmBadge]: https://img.shields.io/npm/v/vue-color-wheel.svg?maxAge=2592000
[npmUrl]: https://www.npmjs.com/package/vue-color-wheel
[npmDtBadge]: https://img.shields.io/npm/dt/vue-color-wheel.svg
[npmDtUrl]: https://www.npmjs.com/package/vue-color-wheel
[bundlePhobiaBadge]: https://img.shields.io/bundlephobia/minzip/vue-color-wheel
[bundlePhobiaUrl]: https://bundlephobia.com/package/vue-color-wheel@latest

> A minimal Vue Color Wheel, built on top of Vite & Vue 3

## Table of Contents

<details>

<summary>TOC</summary>

- [Vue Color Wheel](#vue-color-wheel)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Use the Template](#use-the-template)
    - [GitHub Template](#github-template)
    - [Clone to local](#clone-to-local)
  - [Usage](#usage)
    - [1、Install dependencies](#1install-dependencies)
    - [2、Build a library](#2build-a-library)
    - [3、Publish to npm](#3publish-to-npm)
  - [License](#license)

</details>

## Features

- Package manager [pnpm](https://pnpm.js.org/), safe and fast
- Bundle with the [library mode](https://vitejs.dev/guide/build.html#library-mode)
- Release with [semantic-release](https://www.npmjs.com/package/semantic-release)
- Publish to [npm](https://docs.npmjs.com/cli/v8/commands/npm-publish)

## Use the Template

### GitHub Template

[create a repo from this template on GitHub](https://github.com/new?template_name=vue-color-wheel&template_owner=xiaoluoboding)

### Clone to local

```bash
git clone https://github.com/xiaoluoboding/vue-color-wheel

cd vue-color-wheel
```

## Usage

Building it is as easy as 1, 2, 3.

### 1、Install dependencies

```bash
pnpm install
```

### 2、Build a library

Rename all the `vue-color-wheel` to your component name in the file `package.json、vite.config.ts`, eg: `my-component`

```bash
pnpm run build:lib
```

### 3、Publish to npm

```
npm publish
```

## License

MIT [@xiaoluoboding](https://github.com/xiaoluoboding)
