import { generateSchema } from '../src/index';

const fileNameAndPath = `${__dirname}/output.js`

// Run this file using `npm i && npx ts-node ./example/input.ts`

generateSchema({
  id: 4,
  enabled: true,
}, {
  stdOut: false,
  fileNameAndPath,
  jsModuleOptions: {
    importType: 'import',
    joiOrHapiJoi: 'joi',
    exportType: 'export',
    schemaName: 'myObjSchema'
  }
})
