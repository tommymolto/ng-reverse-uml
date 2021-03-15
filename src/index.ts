import * as ts from 'typescript';
import Elemento from './models/Elemento';
import {join} from 'path';
import Arquivo from "./models/Arquivo";
import generateSequence from './generateSequence';
import SalvaPUML from "./salvaPUML";
import {Tipouml} from "./models/tipouml";

const fs = require('fs');
const config = join(process.cwd(), 'tsconfig.json');

// console.log(components.rootNames);
// console.log(components.rootNames);
// console.log(process.cwd() + '\\example\\extrato-anual.component.ts');

const diretorioArquivo= '/example';
const nomeArquivo =  diretorioArquivo + '/extrato-anual.component.ts'
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

const getAllFiles = function(dirPath: string, arrayOfFiles: Arquivo[]) {
  loga('dir:', process.cwd() + dirPath)
  const files = fs.readdirSync(process.cwd() + dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file: string) {
    loga('38:',process.cwd()  + dirPath + "/" + file)
    if (fs.statSync(process.cwd()  + dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles( dirPath + "/" + file, arrayOfFiles)
    } else {
      // @ts-ignore
      if (file.endsWith('.ts')){
        loga('info:',process.cwd(), dirPath)
        arrayOfFiles.push({
          diretorio: join(process.cwd(), dirPath, "/"),
          arquivo: file
        })

      }
    }
  })

  return arrayOfFiles
}

const geraUmlSequenciaPorArquivo = function(arF: Arquivo[]){
  arF.forEach( (arquivo) => {
    loga('Gerando PUML para ' + arquivo.diretorio  + arquivo.arquivo );
    const puml = new generateSequence(arquivo);
    const arqpuml = new SalvaPUML(arquivo, puml.headers, puml.methods);
    arqpuml.montaSequencia();
    arqpuml.salvaArquivo(Tipouml.Sequencia);

  })
}
const loga = function (...args: any[]){
  // console.log(...args);
}
const listaArq = getAllFiles(diretorioArquivo, []);
console.log('geraremos', listaArq)
geraUmlSequenciaPorArquivo(listaArq)
//console.log(listaArq)
