#!/usr/bin/env node

const arg = require('arg');
const fg = require('fast-glob');
const pc = require('picocolors');
const { findMissedVariables, pluralize } = require('./utils');

const getArgs = () =>
  arg({
    '--cra-start': Boolean,
    '--cra-build': Boolean,
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

  if (!prefix) {
    console.log(pc.red(`\nCheck env variables: please set --prefix parameter\n`))
    return process.kill(process.pid);
  }

  const pattern = args['--pattern'] || './**/*.{ts,tsx,js,jsx}';
  const ignorePattern = ['!**/node_modules'];

  if (args['--ignore-pattern']) {
    ignorePattern.push(args['--ignore-pattern']);
  }

  const files = await fg(pattern, { ignore: ignorePattern });
  const envs = Object.keys(process.env).filter((env) => env?.includes(prefix));
  const missedVariables = await findMissedVariables(files, envs, prefix);
  const amount = missedVariables.length;
  if (amount) {
    const header = pc.red('\nCheck env variables:');
    const names = pc.red(missedVariables.join(', '));
    const pluralValue = pluralize('value', amount);
    const pluralVariable = pluralize('variable', amount);
    const text = pc.yellow(`Please provide ${pluralValue} for ${names} ${pluralVariable}`);

    console.log(`${header}\n${text}`);
    process.kill(process.pid);
  } else {
    console.log(pc.green(`\nCheck env variables: all variables are set`));
  }
};

checkReactEnv();
