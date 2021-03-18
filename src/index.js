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
var uml = '@staruml' +
    ' autoactivate on ';
'participant participant as Usuario';
var getAllFiles = function (dirPath, arrayOfFiles) {
    loga('dir:', process.cwd() + dirPath);
    var files = fs.readdirSync(process.cwd() + dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function (file) {
        loga('38:', process.cwd() + dirPath + "/" + file);
        if (fs.statSync(process.cwd() + dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        }
        else {
            // @ts-ignore
            if (file.endsWith('.ts')) {
                loga('info:', process.cwd(), dirPath);
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
    arF.forEach(function (arquivo) {
        loga('Gerando PUML para ' + arquivo.diretorio + arquivo.arquivo);
        var puml = new generateSequence_1["default"](arquivo);
        var arqpuml = new salvaPUML_1["default"](arquivo, puml.headers, puml.methods);
        arqpuml.montaSequencia();
        arqpuml.salvaArquivo(tipouml_1.Tipouml.Sequencia);
    });
};
var loga = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    // console.log(...args);
};
var listaArq = getAllFiles(diretorioArquivo, []);
console.log('geraremos', listaArq);
geraUmlSequenciaPorArquivo(listaArq);
//console.log(listaArq)
