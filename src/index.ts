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

let stdOut: boolean | undefined;
let fileNameAndPath: string | undefined;
let jsModuleOptions: ExportOptions | undefined;

// Callback function to prettify the output
const handleOutput = (data: Buffer) => {
  const beautifiedJoiSchema = jsBeautify(data.toString())

  if (stdOut) {
    console.log(beautifiedJoiSchema);
  }

  let importText = ''
  let exportText = ''

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


  if (fileNameAndPath) {
    fs.writeFileSync(fileNameAndPath, `${importText}${exportText}${beautifiedJoiSchema}\n`)
  }
}

// Generate the joi schema from an incoming object
export const generateSchema = async (
  objToSchemify: GenericStringKeyObject | GenericNumberKeyObject,
  options: CreateSchemaOptions
) => {
  stdOut = options?.stdOut;
  fileNameAndPath = options?.fileNameAndPath;

  if (!stdOut && !fileNameAndPath) {
    throw new Error('At least one of stdOut or fileNameAndPath must be provided')
  }

  if (jsModuleOptions) {
    const { importType, joiOrHapiJoi, exportType, schemaName } = jsModuleOptions;

    if (!importType || !joiOrHapiJoi || !exportType || !schemaName) {
      throw new Error('missing arguments for jsModuleOptions')
    }
  }

  jsModuleOptions = options?.jsModuleOptions;

  const generator = joiMachine.obj()
  generator.pipe(concatStream({ encoding: 'string' }, handleOutput))
  generator.write(objToSchemify)
  generator.end()
}
