#!/usr/bin/env node

const arg = require('arg');
const fg = require('fast-glob');
const dotenv = require('dotenv');
const pc = require('picocolors');
const { findMissedVariables, pluralize } = require('./utils');

const getArgs = () =>
  arg({
    '--cra-start': Boolean,
    '--cra-build': Boolean,
    '--env': String,
    '--prefix': String,
    '--pattern': String,
    '--ignore-pattern': String,
  });

const checkReactEnv = async () => {
  const args = getArgs();

  let prefix = args['--prefix'] || '';

  if (args['--cra-start'] || args['--cra-build']) {
    process.env.NODE_ENV = args['--cra-start'] ? 'development' : 'production';

    const paths = require('react-scripts/config/paths');
    const getClientEnvironment = require('react-scripts/config/env');

    getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
    prefix = 'REACT_APP_';
  }

  const redHeader = pc.red('\nCheck env variables:');

  if (!prefix) {
    console.log(pc.red(`\n${redHeader} please set --prefix parameter\n`));
    process.kill(process.pid);
  }

  const pattern = args['--pattern'] || './**/*.{ts,tsx,js,jsx}';
  const ignorePattern = ['!**/node_modules'];

  if (args['--ignore-pattern']) {
    ignorePattern.push(args['--ignore-pattern']);
  }

  if (args['--env']) {
    dotenv.config({ path: args['--env'] });
  }

  const envs = Object.keys(process.env).filter((env) => env?.startsWith(prefix));

  if (!envs.length) {
    console.log(`\n${redHeader} current env file doesn't have any variable with prefix ${pc.red(prefix)}.
    \rPlease check correctness of ${pc.blue('--env')} or ${pc.blue('--prefix')} params\n`);
    process.kill(process.pid);
  }

  const files = await fg(pattern, { ignore: ignorePattern });
  if (!files.length) {
    console.log(`\n${redHeader} current pattern doesn't find any file.
    \rPlease check correctness of ${pc.blue('--pattern')} or ${pc.blue('--ignore-pattern')} params\n`);
    process.kill(process.pid);
  }

  const missedVariables = await findMissedVariables(files, envs, prefix);
  const amount = missedVariables.length;
  if (amount) {
    const names = pc.red(missedVariables.join(', '));
    const pluralValue = pluralize('value', amount);
    const pluralVariable = pluralize('variable', amount);
    const text = pc.yellow(`Please provide ${pluralValue} for ${names} ${pluralVariable}`);

    console.log(`${redHeader}\n${text}`);
    process.kill(process.pid);
  } else {
    console.log(pc.green(`\nCheck env variables: all variables are set`));
  }
};

checkReactEnv();
