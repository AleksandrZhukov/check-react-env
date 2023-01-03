#!/usr/bin/env node

const fs = require('fs');
const arg = require('arg');
const fg = require('fast-glob');
const dotenv = require('dotenv');
const pc = require('picocolors');
const { findMissedVariables, pluralize } = require('./utils');

const getArgs = () =>
  arg({
    '--example-env': String,
    '--prefix': String,
    '--pattern': String,
    '--ignore-pattern': String,
  });

const findNewEnv = async () => {
  const args = getArgs();
  const exampleEnvPath = args['--example-env'];
  const redHeader = pc.red('\nFind new env variables:');

  if (!exampleEnvPath) {
    console.log(pc.red(`\n${redHeader} please set --example-env parameter\n`));
    process.kill(process.pid);
  }

  if (!fs.existsSync(exampleEnvPath)) {
    console.log(
      pc.red(
        `\n${redHeader} file ${pc.green(exampleEnvPath)} doesn't exist. Please check correctness of ${pc.blue(
          '--example-env',
        )}  params\n`,
      ),
    );
    process.kill(process.pid);
  }

  const exampleEnvs = dotenv.config({ path: exampleEnvPath }).parsed;

  let prefix = args['--prefix'];

  if (!prefix) {
    console.log(pc.red(`\n${redHeader} please set --prefix parameter\n`));
    process.kill(process.pid);
  }

  const pattern = args['--pattern'] || './**/*.{ts,tsx,js,jsx}';
  const ignorePattern = ['!**/node_modules'];

  if (args['--ignore-pattern']) {
    ignorePattern.push(args['--ignore-pattern']);
  }

  const files = await fg(pattern, { ignore: ignorePattern });
  if (!files.length) {
    console.log(`\n${redHeader} current pattern doesn't find any file.
    \rPlease check correctness of ${pc.blue('--pattern')} or ${pc.blue('--ignore-pattern')} params\n`);
    process.kill(process.pid);
  }

  const newVariables = await findMissedVariables(files, Object.keys(exampleEnvs), prefix);
  const amount = newVariables.length;
  if (amount) {
    const names = pc.red(newVariables.join(', '));
    const pluralValue = pluralize('value', amount);
    const pluralVariable = pluralize('variable', amount);
    const text = pc.yellow(
      `Please add example ${pluralValue} for ${names} ${pluralVariable} into your ${pc.green(exampleEnvPath)} file`,
    );

    console.log(`${redHeader}\n${text}`);
    process.kill(process.pid);
  }
};

findNewEnv();
