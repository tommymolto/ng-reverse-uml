"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliApplication = void 0;
var app_1 = require("./app");
var pkg = require('../package.json');
var program = require('commander');
var scannedFiles = [];
var excludeFiles;
var includeFiles;
var cwd = process.cwd();
process.setMaxListeners(0);
var CliApplication = /** @class */ (function (_super) {
    __extends(CliApplication, _super);
    function CliApplication() {
        return _super.call(this) || this;
    }
    CliApplication.prototype.start = function () {
        // program.storeOptionsAsProperties(true);
        program
            .version(pkg.version)
            .usage('-s <src> [options]')
            .option('-s, --sourcedir [dir]', 'Source code dir')
            .option('-d, --debug', 'display some debugging')
            .helpOption('-h, --HELP', 'read more information')
            .parse(process.argv);
        // this.start();
        var options = program.opts();
        this.inicia(options.sourcedir, options.debug);
    };
    return CliApplication;
}(app_1.Application));
exports.CliApplication = CliApplication;
