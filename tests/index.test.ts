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
  it('should generate a file', async () => {
    const fileNameAndPath = `${__dirname}/output.js`
    console.log(fileNameAndPath)
    await generateSchema(myObj, {
      stdOut: false,
      fileNameAndPath,
      jsImportType: 'import',
      joiOrHapiJoi: 'joi'
    });

    // Try and read the file
    fs.readFileSync(fileNameAndPath).toString()
  })
})