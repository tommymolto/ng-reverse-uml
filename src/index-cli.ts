import * as fs from 'fs-extra';
import * as path from 'path';

import { ts } from 'ts-simple-ast';
import { Application } from './app';
const pkg = require('../package.json');
const program = require('commander');
let scannedFiles = [];
let excludeFiles;
let includeFiles;
let cwd = process.cwd();

process.setMaxListeners(0);

export class CliApplication extends Application {

    constructor() {
        super();
    }
    protected start(): any {

        // program.storeOptionsAsProperties(true);

        program
            .version(pkg.version)
            .usage('-s <src> [options]')
            .option('-s, --sourcedir [dir]', 'Source code dir')
            .option('-d, --debug', 'display some debugging')
            .helpOption('-h, --HELP', 'read more information')
            .parse(process.argv);
        // this.start();
        const options = program.opts();

        this.inicia(options.sourcedir, options.debug);

    }
}
