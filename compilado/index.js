"use strict";
exports.__esModule = true;
var ts = require("typescript");
var path_1 = require("path");
var generateSequence_1 = require("./generateSequence");
var salvaPUML_1 = require("./salvaPUML");
var tipouml_1 = require("./models/tipouml");
var helpers_1 = require("./utils/helpers");
var fs = require('fs');
var commander_1 = require("commander");
var programa = new commander_1.Command();
var helpers = new helpers_1["default"]();
var config = path_1.join(process.cwd(), 'tsconfig.json');
var pkg = require('../package.json');
// console.log(components.rootNames);
// console.log(components.rootNames);
// console.log(process.cwd() + '\\example\\extrato-anual.component.ts');
var diretorioArquivo = '/example';
var nomeArquivo = diretorioArquivo + '/extrato-anual.component.ts';
var file = process.cwd() + nomeArquivo;
console.log('Generating: ', file);
// 'C:\\Users\\tommy\\Downloads\\csf-canais-digitais-web-extrato-anual-de-tarifas\\csf-canais-digitais-web-extrato-anual-de-tarifas\\projects\\extrato-anual-tarifa\\src\\lib\\components\\extrato-anual\\extrato-anual.component.ts';
var program = ts.createProgram([file], { allowJs: true });
var sc = program.getSourceFile(file);
var indent = 0;
var usuario = 'Usuario';
var component = '';
var headers = [];
var properties = [];
var methods = [];
var componentMethods = ['ngOnInit'];
var uml = '@startuml' +
    ' autoactivate on ';
'participant participant as Usuario';
function main() {
    console.log('main');
    programa
        .version('0.2.0')
        .option('-s, --sourcedir <dir>', 'Source code dir')
        .option('-d, --debug', 'display some debugging')
        .parse(process.argv);
    var outputHelp = function () {
        programa.outputHelp();
        process.exit(1);
    };
    /*.action((options, command) => {
      console.log('aqui');
      if (options.debug) {
        console.log('Called %s with options %o', command.name(), options);
      }
      const title = options.title ? `${options.title} ` : '';
      console.log(`Thank-you ${title}${name}`);
      process.exit(1);
    });*/
    //programa.parse();
}
function run() {
    var getAllFiles = function (dirPath, arrayOfFiles) {
        helpers.loga(true, ['dir:', process.cwd() + dirPath]);
        var files = fs.readdirSync(process.cwd() + dirPath);
        arrayOfFiles = arrayOfFiles || [];
        files.forEach(function (file) {
            helpers.loga(false, [process.cwd() + dirPath + "/" + file]);
            if (fs.statSync(process.cwd() + dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
            }
            else {
                // @ts-ignore
                if (file.endsWith('.ts')) {
                    helpers.loga(false, ['info:', process.cwd(), dirPath]);
                    arrayOfFiles.push({
                        diretorio: path_1.join(process.cwd(), dirPath, "/"),
                        arquivo: file
                    });
                }
            }
        });
        return arrayOfFiles;
    };
    var geraUmlSequenciaPorArquivo = function (arF) {
        for (var _i = 0, arF_1 = arF; _i < arF_1.length; _i++) {
            var arquivo = arF_1[_i];
            helpers.loga(false, ['Gerando PUML para ' + arquivo.diretorio + arquivo.arquivo]);
            var puml = new generateSequence_1["default"](arquivo);
            helpers.loga(false, ['novaEstrutura=', JSON.stringify(puml.novaEstrutura)]);
            var arqpuml = new salvaPUML_1["default"](arquivo, puml.headers, puml.methods, puml.novaEstrutura);
            arqpuml.montaSequencia();
            arqpuml.salvaArquivo(tipouml_1.Tipouml.Sequencia);
        }
    };
    var listaArq = getAllFiles(diretorioArquivo, []);
    helpers.loga(false, ['geraremos', listaArq]);
    geraUmlSequenciaPorArquivo(listaArq);
}
main();
//console.log(listaArq)
