import Arquivo from "./models/Arquivo";
import {Tipouml} from './models/tipouml';
import Elemento from './models/Elemento'
import Sequencia from "./models/Sequencia";
import Helpers from "./utils/helpers";
const fs = require('fs');

export default class SalvaPUML{
    public cabecalhos =[];
    public metodos = [];
    public conteudo = '';
    public arquivo: Arquivo;
    public estrutura: Sequencia[] = [] as Sequencia[];
    public metodoAtual = '';
    public componentetual = '';
    public cores = ['#005500','#0055FF','#0055F0','#00FF00','#0055F0'];
    public helpers: Helpers;
    public debuga: boolean = false;
    public astSource: string = '';
    constructor(arquivo: Arquivo,
                cabecalhos: Elemento[] = [],
                metodos: string[] = [],
                estrutura: Sequencia[] = [] as Sequencia[],
                loga: boolean = false,
                astSource: string = '') {
        this.debuga = loga ? true : false;

        this.arquivo = arquivo;
        this.cabecalhos = cabecalhos;
        this.metodos = metodos;
        this.estrutura = estrutura;
        this.astSource = astSource !== '' ? astSource : '';
        console.log('nova=>', astSource);
        this.helpers = new Helpers();
    }
     async montaSequencia() {
        this.conteudo += '@startuml \r\n' +
            ' participant participant as Usuario\r\n';
        this.cabecalhos.forEach((cab: Elemento) => {
            this.conteudo += cab.type + ' ' + cab.originalComponent + ' as ' + cab.aliasComponent + '<<'+ cab.aliasComponent+' >> \r\n';
        });
        this.loopSequencia(this.estrutura);
        this.conteudo += '@enduml';
    }

     async loopSequencia( structGlobal: Sequencia[] | undefined, caller: string = 'Usuario', indiceGlobal: number = 0){
        this.helpers.loga(this.debuga, ['[indiceGlobal=' + indiceGlobal + ']',
            JSON.stringify(structGlobal)]);

        // structGlobal?.forEach(async (x: Sequencia, indice, objeto: Sequencia[]) => {
         const structGlobal1 = structGlobal ;
         // @ts-ignore
         for (const x of structGlobal1){
            this.conteudo += caller + ' -> ' + x.componente + ':' + x.metodo +'\r\n';
            this.helpers.loga(this.debuga, ['[SAIDA]', caller + ' -> ' + x.componente + ':' + x.metodo +'\r\n']);
            this.conteudo += 'activate '+ x.componente + ' ' + this.cores[indiceGlobal] + '\r\n';
            this.helpers.loga(this.debuga, ['[SAIDA]', 'activate '+ x.componente + ' ' + this.cores[indiceGlobal] + '\r\n']);
            this.validaChamadas(x, indiceGlobal);
            this.conteudo += 'deactivate ' + x.componente + '\r\n';
            this.helpers.loga(this.debuga, ['[SAIDA]', 'deactivate '+ x.componente +  '\r\n']);


        }//)

    }
     async validaChamadas(x:  Sequencia, indiceGlobal: number = 0){
        // @ts-ignore
         for (const y of x.chamadas) {
            this.helpers.loga(this.debuga, ['Filtro de metodo = ', x.metodo]);
            let zz: number = this.estrutura?.findIndex(k => k.metodo === y.metodo) || 0;
            this.helpers.loga(this.debuga, ['Indice = ', zz]);
            if (zz && zz >= 0){
                const t: Sequencia[] = [] as Sequencia[];
                const comp = this.estrutura[zz].componente;
                t.push(this.estrutura[zz]);
                this.helpers.loga(this.debuga, ['Loop em  = ', t]);
                indiceGlobal++;
                this.estrutura.splice(zz,1);
                await this.loopSequencia( t, comp, indiceGlobal);
            } else {
                this.conteudo += x.componente + ' -> ' + y.componente+ ':' + y.metodo +'\r\n';
                this.helpers.loga(this.debuga, ['[SemMetodo][SAIDA]', x.componente + ' -> ' + y.componente+ ':' + y.metodo +'\r\n']);

            }
            // this.conteudo += 'deactivate ' + x.componente + '\r\n';

        }
     }
    salvaArquivo(tipoUML = Tipouml.Sequencia){
        this.helpers.loga(this.debuga, ['conteudo=',this.conteudo]);
        const f = this.arquivo.diretorio + this.arquivo.arquivo + '.' + tipoUML + '.puml';
        fs.writeFile(f, this.conteudo,  (err) => {
            if (err) return console.log(err);
            console.log('Generating > ', f );
        })
    }
    salvaAST(tipoUML = Tipouml.AST){
        this.helpers.loga(this.debuga, ['conteudo=',this.conteudo]);
        const f = this.arquivo.diretorio + '.' + this.arquivo.arquivo + '.' + tipoUML ;
        fs.writeFile(f, this.astSource,  (err) => {
            if (err) return console.log(err);
            console.log('Generating > ', f );
        })
    }

}
