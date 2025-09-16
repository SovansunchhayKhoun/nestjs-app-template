const fs = require('fs');

const NODE_ENV = process.argv[2];
console.log('🚀 ~ ENV_MODE:', NODE_ENV);

function envFactory() {
  return '.env';
}

fs.copyFile(`${process.cwd()}/env/${NODE_ENV}.env`, envFactory(), (err) => {
  if (err) {
    console.log(`Error while copying ${NODE_ENV}.env`, err);
  } else {
    console.log(`Copied from ${NODE_ENV}.env to ${envFactory()} successfully`);
  }
});
