### joi-schema-to-file

Take a JavaScript object and generate a joi schema, outputted into a file.

Wraps the functionality of the `joi-machine` npm package and outputs in a more readable / usable format.

## Install
```
npm i joi-schema-to-file
```

## Usage

```javascript
import { generateSchema } from 'joi-schema-to-file'

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

const fileNameAndPath = `YOUR_DIRECTORY/YOUR_FILENAME.js`

// stdOut: true will also log the generated schema to the console
generateSchema(myObj, { stdOut: false, fileNameAndPath });

// Generates a file in the your specified directory with the following contents:
Joi.object().keys({
    stringKey: Joi.string(),
    numberKey: Joi.number().integer(),
    objectKey: Joi.object().keys({
        str: Joi.string()
    }),
    arrayKey: Joi.array().items(Joi.string(), Joi.string())
})
```
