"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var concat_stream_1 = __importDefault(require("concat-stream"));
// @ts-ignore -- no types are available for joi-machine
var joi_machine_1 = __importDefault(require("joi-machine"));
var js_beautify_1 = __importDefault(require("js-beautify"));
var fs_1 = __importDefault(require("fs"));
var stdOut;
// let path: string | undefined;
var fileNameAndPath;
// Callback function to prettify the output
var handleOutput = function (data) {
    var beautifiedJoiSchema = js_beautify_1.default(data.toString());
    if (stdOut) {
        console.log(beautifiedJoiSchema);
    }
    if (fileNameAndPath) {
        fs_1.default.writeFileSync(fileNameAndPath, beautifiedJoiSchema);
    }
};
// Generate the joi schema from an incoming object
exports.getSchema = function (myObj, options) {
    var _a;
    stdOut = options === null || options === void 0 ? void 0 : options.stdOut;
    fileNameAndPath = (_a = options === null || options === void 0 ? void 0 : options.fileOptions) === null || _a === void 0 ? void 0 : _a.fileNameAndPath;
    var generator = joi_machine_1.default.obj();
    generator.pipe(concat_stream_1.default({ encoding: 'string' }, handleOutput));
    generator.write(myObj);
    generator.end();
};
// My JavaScript object
var myObj = {
    stringKey: 'string',
    numberKey: 1,
    objectKey: {
        str: 'str'
    },
    arrayKey: [
        'string1',
        'string2'
    ]
};
exports.getSchema(myObj, { stdOut: true, fileOptions: { fileNameAndPath: './output.js' } });
