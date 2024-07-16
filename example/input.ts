import { CreateSchemaOptions, generateSchema } from '../src/index';

const fileNameAndPath = `${__dirname}/output.js`

// Run this file using `npm i && npx ts-node ./example/input.ts`

const myObject = {
  id: 4,
  enabled: true,
}

const options: CreateSchemaOptions = {
  stdOut: false,
  fileNameAndPath,
  jsModuleOptions: {
    importType: 'import',
    joiOrHapiJoi: 'joi',
    exportType: 'export',
    schemaName: 'myObjSchema'
  }
}

generateSchema(myObject, options)
