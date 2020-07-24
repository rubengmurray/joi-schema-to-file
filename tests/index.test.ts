import 'mocha';
import { generateSchema } from '../src/index';
import fs from 'fs';
// import path from 'path';

// My JavaScript object
const myObj = {
  stringKey: 'string',
  numberKey: 1,
  objectKey: {
    str: 'str'
  },
  arrayKey:[
    'string1',
    'string2'
  ]
}

describe('Tests', () => {
  it('should generate a TypeScript type import file', async () => {
    const fileNameAndPath = `${__dirname}/import-export-output.js`
    console.log(fileNameAndPath)
    await generateSchema(myObj, {
      stdOut: false,
      fileNameAndPath,
      jsModuleOptions: {
        importType: 'import',
        joiOrHapiJoi: 'joi',
        exportType: 'export',
        schemaName: 'myObjSchema'
      }
    });

    // Try and read the file
    fs.readFileSync(fileNameAndPath).toString()
  })

  it('should generate a vanilla js require file', async () => {
    const fileNameAndPath = `${__dirname}/require-module-output.js`
    console.log(fileNameAndPath)
    await generateSchema(myObj, {
      stdOut: false,
      fileNameAndPath,
      jsModuleOptions: {
        importType: 'require',
        joiOrHapiJoi: '@hapi/joi',
        exportType: 'module',
        schemaName: 'myObjSchema'
      }
    });

    // Try and read the file
    fs.readFileSync(fileNameAndPath).toString()
  })

  it('should generate a joi schema with no export', async () => {
    const fileNameAndPath = `${__dirname}/schema-only-output.js`
    console.log(fileNameAndPath)
    await generateSchema(myObj, {
      stdOut: false,
      fileNameAndPath,
    });

    // Try and read the file
    fs.readFileSync(fileNameAndPath).toString()
  })
})