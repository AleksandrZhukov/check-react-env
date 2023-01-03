check-react-env
=========

Check that all used environment variables are set.

❗This tool expects that all env variables have same prefix, eg. REACT_APP_

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
Add `--env` param to specify `.env` file to analyze.
```
"prestart": "check-react-env --prefix=NX_ --env=.env.development",
```
Optionally add `--pattern` to specify files to analyze, by default equals `./**/*.{ts,tsx,js,jsx}`, so it checks all `javaScript` and `typeScript` files

```
"prestart": "check-react-env --prefix=NX_ --env=.env.development --pattern='libs/**/*.{ts,tsx,js,jsx}'",
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
<details>
    <summary>Click me</summary>

#### --prefix
* Required: `true` (for non-CRA apps)
* Type: `string`

A prefix for env variables, eg. `REACT_APP_` or `NX_`.

#### --env
* Type: `string`

Path to desired `.env` file.

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

</details>

---
<br/>

find-new-env
=========

Helps do not forget to provide example for env variables.

## Usage
Perfectly to add this tool to the pre-commit hook, using for example [husky](https://www.npmjs.com/package/husky)

```
find-new-env --example-env=.env.example --prefix=REACT_APP_ --pattern='app/**/*.{ts,tsx,js,jsx}'
```

## Parameters
<details>
    <summary>Click me</summary>

#### --prefix
* Required: `true`
* Type: `string`

A prefix for env variables, eg. `REACT_APP_` or `NX_`.

#### --example-env
* Required: `true`
* Type: `string`

Path to the file with env examples.

#### --pattern
* Type: `string`
* Default: `./**/*.{ts,tsx,js,jsx}`

Any correct glob pattern. Check [fast-glob#basic-syntax](https://github.com/mrmlnc/fast-glob#basic-syntax) for more details.

#### --ignore-pattern
* Type: `string`

Glob pattern to exclude matches.
</details>

## License

MIT