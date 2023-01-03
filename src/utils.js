const fs = require('fs');
const readline = require('readline');

const findMissedVariables = async (files, envs, prefix) => {
  const missedVariables = new Set();

  await Promise.all(
    files.map(async (file) => {
      const fileStream = fs.createReadStream(file);

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        const regex = new RegExp(`${prefix}\\w+`);
        const match = line.match(regex);
        const env = match?.[0];
        if (env && !envs.includes(env)) {
          missedVariables.add(env);
        }
      }
    }),
  );

  return Array.from(missedVariables);
};

const pluralize = (noun, count) => `${noun}${count !== 1 ? 's' : ''}`;

module.exports = {
  findMissedVariables,
  pluralize,
};
