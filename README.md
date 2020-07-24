### joi-schema-to-file

Take any JavaScript object and output a `joi` schema to an importable module.

Thanks to Alan Shaw for the underlying work on `joi-machine`, which this module wraps.

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

// Specificy the full path to the file you want to create
const fileNameAndPath = `${__dirname}/output.js`

await generateSchema(myObj, {
  stdOut: false, // setting this to true will also log the generated schema to the console
  fileNameAndPath,
  jsImportType: 'import',
  joiOrHapiJoi: 'joi'
});

// Try and read the file
fs.readFileSync(fileNameAndPath).toString()
```

Generates a file in the specified directory with the following:

```javascript
const Joi = require('joi')

export default Joi.object().keys({
    stringKey: Joi.string(),
    numberKey: Joi.number().integer(),
    objectKey: Joi.object().keys({
        str: Joi.string()
    }),
    arrayKey: Joi.array().items(Joi.string(), Joi.string())
})
```

One test included in the github repo that generates the above.
