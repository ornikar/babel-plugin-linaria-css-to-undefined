# babel-plugin-linaria-css-to-undefined

## Features

This plugin was created to allow to delete linaria in react-native plateform, while still using it for the web.

## Install

```bash
npm install --save-dev --save-exact babel-plugin-linaria-css-to-undefined
```

## Example

Source:

```js
import { css } from '@linaria/core';
const className = css`
  display: flex;
`;
```

Transformed to:

```js
const className = undefined;
```

## Usage

### Via `babel.config.json`

```json
{
  "plugins": ["babel-plugin-linaria-css-to-undefined"]
}
```
