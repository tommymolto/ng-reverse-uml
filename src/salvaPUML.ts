import Arquivo from "./models/Arquivo";
import {Tipouml} from './models/tipouml';
import Elemento from './models/Elemento'
const fs = require('fs');

export default class SalvaPUML{
    public cabecalhos =[];
    public metodos = [];
    public conteudo = '';
    public arquivo: Arquivo;
    constructor(arquivo: Arquivo, cabecalhos: Elemento[] = [], metodos: string[] = []) {
        this.arquivo = arquivo;
        this.cabecalhos = cabecalhos;
        this.metodos = metodos;
    }
    montaSequencia(){
        this.conteudo = '@startuml \r\n' +
            ' autoactivate on \r\n' +
            ' participant participant as Usuario\r\n';
        this.cabecalhos.forEach((cab: Elemento) => {
            this.conteudo += cab.type + ' ' + cab.originalComponent + ' as ' + cab.aliasComponent + '\r\n';
        });
        this.metodos.forEach( (linha: string) => {
            this.conteudo += linha + ' \r\n';
        });
        this.conteudo += '@enduml';
    }
    salvaArquivo(tipoUML = Tipouml.Sequencia){
        const f = this.arquivo.diretorio + this.arquivo.arquivo + '.' + tipoUML + '.puml';
        fs.writeFile(f, this.conteudo,  (err) => {
            if (err) return console.log(err);
            console.log('Generating > ', f );
        })
    }

}
