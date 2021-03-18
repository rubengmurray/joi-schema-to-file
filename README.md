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

// NOTE: Cannot currently be run concurrently

// Specify the full path to the file you want to create (e.g.)
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

const fileNameAndPath = `${__dirname}/schema-only-output.js`
generateSchema(myObj, {
  stdOut: false,
  fileNameAndPath,
});
```

Generates the following three files in the specified directory with the following:

```javascript
import Joi from 'joi'

export const myObjSchema = Joi.object().keys({
    stringKey: Joi.string(),
    numberKey: Joi.number().integer(),
    objectKey: Joi.object().keys({
        str: Joi.string()
    }),
    arrayKey: Joi.array().items(Joi.string(), Joi.string())
})
```

```javascript
const Joi = require('@hapi/joi')

exports.myObjSchema = Joi.object().keys({
    stringKey: Joi.string(),
    numberKey: Joi.number().integer(),
    objectKey: Joi.object().keys({
        str: Joi.string()
    }),
    arrayKey: Joi.array().items(Joi.string(), Joi.string())
})
```

```javascript
Joi.object().keys({
    stringKey: Joi.string(),
    numberKey: Joi.number().integer(),
    objectKey: Joi.object().keys({
        str: Joi.string()
    }),
    arrayKey: Joi.array().items(Joi.string(), Joi.string())
})
```

One test included in the github repo that generates the above.
