const { writeFile } = require('fs');
const { argv } = require('yargs');
const { version } = require('../package.json');

// read environment variables from .env file
require('dotenv').config();

// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const isPostBuild = argv.isPostBuild === 'true';

if (!process.env.BASE_URL) {
   console.error('A URL da API não foi informada, favor informar a mesma antes de subir a aplicação!');
   process.exit(-1);
}

const targetPath = isProduction
   ? `./src/environments/environment.prod.ts`
   : `./src/environments/environment.ts`;

// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   apiUrl: ${isProduction && !isPostBuild ? "'" + process.env.BASE_URL + "'" : (isPostBuild && isProduction ? 'process.env.BASE_URL' : "'https://gestao-prontuario.herokuapp.com'")},
   appVersion: '${version + (isProduction ? '' : '-dev')}'
};
`;
// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err) {
   if (err) {
      console.log(err);
   }
   console.log(`Utilizando variáveis de ${targetPath}`);
});