check-react-env
=========

Check that all used environment variables are set.

## Installation

```
npm install --save-dev check-react-env
```
or
```
yarn add --dev check-react-env
```

## Usage

### Basic Usage

Add this tool before `start` or `build` scripts of your application into your package.json.
You can also use `pre` script, more details [here](https://docs.npmjs.com/cli/v9/using-npm/scripts#pre--post-scripts).

Specify `--prefix` param based on your env variables.

```
"prestart": "check-react-env --prefix=NX_",
```
Optionally add `--pattern` to specify files to analyze, by default equals `./**/*.{ts,tsx,js,jsx}`, so it checks all `javaScript` and `typeScript` files

```
"prestart": "check-react-env --prefix=NX_ --pattern='libs/**/*.{ts,tsx,js,jsx}'",
```
### CRA Usage

Add two pre-script into your package.json. Flags are critical for selecting correct env file, check more [here](https://create-react-app.dev/docs/adding-custom-environment-variables/#what-other-env-files-can-be-used)
```
"prestart": "check-react-env --cra-start",
```
add
```
"prebuild": "check-react-env --cra-build",
```

## Parameters

#### --prefix
* Required: `true` (for non-CRA apps)
* Type: `string`

A prefix for env variables, eg. `REACT_APP_` or `NX_`.

#### --pattern
* Type: `string`
* Default: `./**/*.{ts,tsx,js,jsx}`

Any correct glob pattern. Check [fast-glob#basic-syntax](https://github.com/mrmlnc/fast-glob#basic-syntax) for more details.

#### --ignore-pattern
* Type: `string`

Glob pattern to exclude matches.

### For CRA apps

#### --cra-start
* Type: `boolean`

Flag for CRA start script, uses development envs

#### --cra-build
* Type: `boolean`

Flag for CRA build script, uses production envs


## License

MIT