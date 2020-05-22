import 'mocha';
import { generateSchema } from '../src/index';
import fs from 'fs';
import path from 'path';

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
    await generateSchema(myObj, { stdOut: false, fileNameAndPath });

    // Try and read the file
    fs.readFileSync(fileNameAndPath).toString()
  })
})