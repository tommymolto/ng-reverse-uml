import * as ts from 'typescript';
const fs = require('fs');
import type Elemento from './models/Elemento';
import { join } from 'path';
import Arquivo from "./models/Arquivo";
const config = join(process.cwd(), 'tsconfig.json');

// console.log(components.rootNames);
// console.log(components.rootNames);
// console.log(process.cwd() + '\\example\\extrato-anual.component.ts');

const diretorioArquivo='example';
const nomeArquivo =  diretorioArquivo + '\\extrato-anual.component.ts'
const file = process.cwd() + nomeArquivo;
console.log('Generating: ', file);
// 'C:\\Users\\tommy\\Downloads\\csf-canais-digitais-web-extrato-anual-de-tarifas\\csf-canais-digitais-web-extrato-anual-de-tarifas\\projects\\extrato-anual-tarifa\\src\\lib\\components\\extrato-anual\\extrato-anual.component.ts';
const program = ts.createProgram([file], { allowJs: true });
const sc = program.getSourceFile(file);
let indent = 0;
let usuario = 'Usuario';
let component = '';
let headers : Elemento[] = [];
let properties = [];
let methods = [];
let componentMethods= ['ngOnInit'];
let uml = '@staruml' +
' autoactivate on '
  'participant participant as Usuario';

const getAllFiles = function(dirPath, arrayOfFiles: Arquivo[]) {
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      // @ts-ignore
      if (file.endsWith('.ts')) arrayOfFiles.push({
        diretorio: join(__dirname, dirPath, "/"),
        arquivo: file
      })
    }
  })

  return arrayOfFiles
}
const listaArq = getAllFiles(diretorioArquivo, []);
console.log(listaArq)
