import * as ts from 'typescript';
import Elemento from './models/Elemento';
import {join} from 'path';
import Arquivo from "./models/Arquivo";
import generateSequence from './generateSequence';
import SalvaPUML from "./salvaPUML";
import {Tipouml} from "./models/tipouml";
import Helpers from "./utils/helpers";
const fs = require('fs');

const programa= require('commander');
const helpers = new Helpers();
const config = join(process.cwd(), 'tsconfig.json');
const pkg = require('../package.json');
// console.log(components.rootNames);
// console.log(components.rootNames);
// console.log(process.cwd() + '\\example\\extrato-anual.component.ts');

const diretorioArquivo= '/example';
const nomeArquivo =  diretorioArquivo + '/extrato-anual.component.ts'
const file = process.cwd() + nomeArquivo;
const program = ts.createProgram([file], { allowJs: true });
const sc = program.getSourceFile(file);
let indent = 0;
let usuario = 'Usuario';
let component = '';
let headers : Elemento[] = [];
let properties = [];
let methods = [];
let componentMethods= ['ngOnInit'];



export class Application {
    public listaArq: Arquivo[] = [] as Arquivo[];
    public debuga: boolean = false;
    constructor() {

    }
    inicia(fonte: string, loga: string){
        this.debuga = loga ? true : false;
        const dir = '/' + fonte;
        console.log('vamos em ' + dir);
        // process.exit();
        this.listaArq = this.getAllFiles(dir, []);
        helpers.loga(false, ['geraremos', this.listaArq]);
        this.geraUmlSequenciaPorArquivo(this.listaArq);
    }
    geraUmlSequenciaPorArquivo(arF: Arquivo[]) {
        for (const arquivo of arF) {
            helpers.loga(this.debuga, ['Gerando PUML para ' + arquivo.diretorio + arquivo.arquivo]);
            const puml = new generateSequence(arquivo);
            helpers.loga(this.debuga, ['novaEstrutura=', JSON.stringify(puml.novaEstrutura)]);
            const arqpuml = new SalvaPUML(arquivo, puml.headers, puml.methods, puml.novaEstrutura);
            arqpuml.montaSequencia();
            arqpuml.salvaArquivo(Tipouml.Sequencia);

        }
    }
    getAllFiles(dirPath: string, arrayOfFiles: Arquivo[]) : Arquivo[]{
        helpers.loga(this.debuga, ['dir:', process.cwd() + dirPath]);
        const files = fs.readdirSync(process.cwd() + dirPath);

        arrayOfFiles = arrayOfFiles || []

        files.forEach((file: string) => {
            helpers.loga(this.debuga, [process.cwd() + dirPath + "/" + file]);
            if (fs.statSync(process.cwd() + dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = this.getAllFiles(dirPath + "/" + file, arrayOfFiles)
            } else {
                // @ts-ignore
                if (file.endsWith('.ts')) {
                    helpers.loga(this.debuga, ['info:', process.cwd(), dirPath])
                    arrayOfFiles.push({
                        diretorio: join(process.cwd(), dirPath, "/"),
                        arquivo: file
                    })

                }
            }
        })

        return arrayOfFiles;
    }
    get application(): Application {
        return this;
    }

    get isCLI(): boolean {
        return false;
    }
}

