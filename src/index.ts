import concatStream from 'concat-stream';
// @ts-ignore -- no types are available for joi-machine
import joiMachine from 'joi-machine';
import jsBeautify from 'js-beautify';
import fs from 'fs';

interface GenericStringKeyObject { [key: string]: unknown }
interface GenericNumberKeyObject { [key: number]: unknown }
interface CreateSchemaOptions {
  stdOut: boolean;
  fileNameAndPath: string;
  jsImportType: 'require' | 'import';
  joiOrHapiJoi: 'joi' | '@hapi/joi'
}

let stdOut: boolean | undefined;
let fileNameAndPath: string | undefined;
let jsImportType: 'require' | 'import';
let joiOrHapiJoi: 'joi' | '@hapi/joi';

// Callback function to prettify the output
const handleOutput = (data: Buffer) => {
  const beautifiedJoiSchema = jsBeautify(data.toString())

  if (stdOut) {
    console.log(beautifiedJoiSchema);
  }

  let importText

  switch(jsImportType) {
    case 'import':
      importText = `import Joi from '${joiOrHapiJoi}'`
    case 'require':
      importText = `const Joi = require('${joiOrHapiJoi}')`
  }

  if (fileNameAndPath) {
    fs.writeFileSync(fileNameAndPath, `${importText}\n\nexport default ${beautifiedJoiSchema}`)
  }
}

// Generate the joi schema from an incoming object
export const generateSchema = async (
  objToSchemify: GenericStringKeyObject | GenericNumberKeyObject,
  options: CreateSchemaOptions
) => {
  stdOut = options?.stdOut
  fileNameAndPath = options?.fileNameAndPath
  joiOrHapiJoi = options.joiOrHapiJoi
  jsImportType = options.jsImportType

  const generator = joiMachine.obj()
  generator.pipe(concatStream({ encoding: 'string' }, handleOutput))
  generator.write(objToSchemify)
  generator.end()
}
