"use strict";
exports.__esModule = true;
var ts = require("typescript");
var fs = require('fs');
var path_1 = require("path");
var config = path_1.join(process.cwd(), 'tsconfig.json');
// console.log(components.rootNames);
// console.log(components.rootNames);
// console.log(process.cwd() + '\\example\\extrato-anual.component.ts');
var diretorioArquivo = 'example';
var nomeArquivo = diretorioArquivo + '\\extrato-anual.component.ts';
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
    var files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        }
        else {
            // @ts-ignore
            if (file.endsWith('.ts'))
                arrayOfFiles.push({
                    diretorio: path_1.join(__dirname, dirPath, "/"),
                    arquivo: file
                });
        }
    });
    return arrayOfFiles;
};
var listaArq = getAllFiles(diretorioArquivo, []);
console.log(listaArq);
