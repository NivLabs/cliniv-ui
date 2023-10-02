const { writeFile } = require('fs');
const { argv } = require('yargs');
const { version } = require('../package.json');

// read environment variables from .env file
require('dotenv').config();

// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const isPostBuild = argv.isPostBuild === 'true';
const baseURL = process.env.BASE_URL ? process.env.BASE_URL : 'https://cliniv.cloud';
const customerId = process.env.CUSTOMER_ID ? process.env.CUSTOMER_ID : 'cliniv';
const customerName = process.env.CUSTOMER_NAME ? process.env.CUSTOMER_NAME : 'NivLabs';


const targetPath = isProduction
   ? `./src/environments/environment.prod.ts`
   : `./src/environments/environment.ts`;

// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   apiUrl: ${isProduction && !isPostBuild ? "'" + baseURL + "'" : 'process.env.BASE_URL'},
   appVersion: '${version + (isProduction ? '' : '-dev')}',
   customerId: '${customerId}',
   customerName: '${customerName}'
};
`;
// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err) {
   if (err) {
      console.log(err);
   }
   console.log(`Utilizando variáveis de ${targetPath}`);
});