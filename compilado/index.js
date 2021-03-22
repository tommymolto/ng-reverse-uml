"use strict";
exports.__esModule = true;
var ts = require("typescript");
var path_1 = require("path");
var generateSequence_1 = require("./generateSequence");
var salvaPUML_1 = require("./salvaPUML");
var tipouml_1 = require("./models/tipouml");
var fs = require('fs');
var config = path_1.join(process.cwd(), 'tsconfig.json');
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
var getAllFiles = function (dirPath, arrayOfFiles) {
    loga(true, ['dir:', process.cwd() + dirPath]);
    var files = fs.readdirSync(process.cwd() + dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function (file) {
        loga(false, [process.cwd() + dirPath + "/" + file]);
        if (fs.statSync(process.cwd() + dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        }
        else {
            // @ts-ignore
            if (file.endsWith('.ts')) {
                loga(false, ['info:', process.cwd(), dirPath]);
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
        loga(false, ['Gerando PUML para ' + arquivo.diretorio + arquivo.arquivo]);
        var puml = new generateSequence_1["default"](arquivo);
        loga(false, ['novaEstrutura=', JSON.stringify(puml.novaEstrutura)]);
        var arqpuml = new salvaPUML_1["default"](arquivo, puml.headers, puml.methods, puml.novaEstrutura);
        arqpuml.montaSequencia();
        arqpuml.salvaArquivo(tipouml_1.Tipouml.Sequencia);
    }
};
var loga = function (fg) {
    if (fg === void 0) { fg = true; }
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (fg)
        console.log.apply(console, args);
};
var listaArq = getAllFiles(diretorioArquivo, []);
loga(false, ['geraremos', listaArq]);
geraUmlSequenciaPorArquivo(listaArq);
//console.log(listaArq)
