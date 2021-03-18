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
  jsModuleOptions?: ExportOptions
}

interface ExportOptions {
  importType: 'import' | 'require';
  joiOrHapiJoi: 'joi' | '@hapi/joi';
  exportType: 'export' | 'module';
  schemaName: string;
}

// TODO: Remove this mutation...
let stdOut: boolean | undefined;
let fileNameAndPath: string | undefined;

// Callback function to prettify the output
const handleOutput = (data: Buffer, jsModuleOptions: ExportOptions | undefined) => {
  const beautifiedJoiSchema = jsBeautify(data.toString())

  if (stdOut) {
    console.log(beautifiedJoiSchema);
  }

  // TODO: mutation... eeww
  let importText = ''
  let exportText = ''

  console.log(jsModuleOptions)
  // Is a global because concatStream doesn't accept with two args
  if (jsModuleOptions) {

    switch(jsModuleOptions.importType) {
      case 'import':
        importText = `import Joi from '${jsModuleOptions.joiOrHapiJoi}'\n\n`
        break;
      case 'require':
        importText = `const Joi = require('${jsModuleOptions.joiOrHapiJoi}')\n\n`
        break;
      default:
        throw new Error('importType not defined in exportOptions')
    }

    switch(jsModuleOptions.exportType) {
      case 'export':
        exportText = `export const ${jsModuleOptions.schemaName} = `
        break;
      case 'module':
        exportText = `exports.${jsModuleOptions.schemaName} = `
        break;
      default:
        throw new Error('exportType not defined in exportOptions')
    }
  }

  console.log(importText, exportText)

  if (fileNameAndPath) {
    fs.writeFileSync(fileNameAndPath, `${importText}${exportText}${beautifiedJoiSchema}\n`)
  }
}

// Generate the joi schema from an incoming object
export const generateSchema = (
  objToSchemify: GenericStringKeyObject | GenericNumberKeyObject,
  options: CreateSchemaOptions
) => {
  stdOut = options?.stdOut;
  fileNameAndPath = options?.fileNameAndPath;

  if (!stdOut && !fileNameAndPath) {
    throw new Error('At least one of stdOut or fileNameAndPath must be provided')
  }

  if (options?.jsModuleOptions) {
    const { importType, joiOrHapiJoi, exportType, schemaName } = options.jsModuleOptions;

    if (!importType || !joiOrHapiJoi || !exportType || !schemaName) {
      throw new Error('missing arguments for jsModuleOptions')
    }
  }

  const generator = joiMachine.obj()
  generator.pipe(concatStream({ encoding: 'string' }, (data: Buffer) => handleOutput(data, options.jsModuleOptions)))
  generator.write(objToSchemify)
  generator.end()
}
