import 'mocha';
import { generateSchema } from '../src/index';
import fs from 'fs';
import { setTimeout } from 'timers/promises';
import { assert } from 'console';
import Joi from 'joi';

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
    generateSchema(myObj, {
      stdOut: false,
      fileNameAndPath,
      jsModuleOptions: {
        importType: 'import',
        joiOrHapiJoi: 'joi',
        exportType: 'export',
        schemaName: 'myObjSchema'
      }
    });

    // Wait for the file to be written to disc
    await setTimeout(3000);

    // Try and read the file
    const res = fs.readFileSync(fileNameAndPath).toString()

    assert(res.includes("import Joi from 'joi'"));

    fs.rmSync(fileNameAndPath);
  })

  it('should generate a vanilla js require file', async () => {
    const fileNameAndPath = `${__dirname}/require-module-output.js`
    generateSchema(myObj, {
      stdOut: false,
      fileNameAndPath,
      jsModuleOptions: {
        importType: 'require',
        joiOrHapiJoi: '@hapi/joi',
        exportType: 'module',
        schemaName: 'myObjSchema'
      }
    });

    // Wait for the file to be written to disc
    await setTimeout(3000);

    // Try and read the file
    const { myObjSchema } = require(fileNameAndPath);
    
    // Validate the original object against the new schema
    await Joi.validate(myObj, myObjSchema);

    fs.rmSync(fileNameAndPath);
  })

  it('should generate a joi schema with no export', async () => {
    const fileNameAndPath = `${__dirname}/schema-only-output.js`
    generateSchema(myObj, {
      stdOut: false,
      fileNameAndPath,
    });

    // Wait for the file to be written to disc
    await setTimeout(3000);

    // Try and read the file
    fs.readFileSync(fileNameAndPath).toString();

    fs.rmSync(fileNameAndPath);
  })
})
