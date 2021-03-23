import { join } from 'path';
// import { WorkspaceSymbols } from 'ngast';
import * as ts from 'typescript';
const fs = require('fs');
import  Elemento from './models/Elemento';
import Arquivo from "./models/Arquivo";
import Sequencia from "./models/Sequencia";
const config = join(process.cwd(), 'tsconfig.json');

export default class generateSequence {
    private program ;
    private sc ;
    // public indent: number = 0;
    usuario = 'Usuario';
    component = '';
    public headers : Elemento[] = [];
    properties = [];
    contagemMetodos = 0;
    cores = ['#005500','#0055FF','#0055F0','#00FF00','#0055F0'];
    public methods = [];
    componentMethods= ['ngOnInit'];
    uml = '@startuml' +
        ' autoactivate on ' +
        ' participant participant as Usuario';
    diretorioArquivo = '';
    nomeArquivo =  '';
    public novaEstrutura: Sequencia[] = [];
    public metodoAtual = '';


    constructor(arq: Arquivo){
        this.diretorioArquivo = arq.diretorio;
        this.nomeArquivo = this.diretorioArquivo + arq.arquivo;
        const file = process.cwd() + this.nomeArquivo;
        this.loga(false, ['file: ',this.nomeArquivo] );
        this.program = ts.createProgram([this.nomeArquivo], { allowJs: true });
        this.sc = this.program.getSourceFile( this.nomeArquivo );
        this.loga(false,['lendo ', this.sc]);
        // @ts-ignore
        ts.forEachChild(this.sc, x => {
            // console.log(x);
            this.exibe(x);
        })
        this.loga(false,['headers', this.headers]);
        // this.loga(true,['methods', this.methods]);
        this.loga(true,['novaEstrutura', this.novaEstrutura]);
    }



    exibe(node: ts.Node) {
        this.loga(false,['exibe', node])
        if(ts.SyntaxKind[node.kind] === 'Constructor') {

            ts.forEachChild(node, x => {
                if (ts.SyntaxKind[x.kind] === 'Parameter') {
                    const l = JSON.parse(JSON.stringify(x));
                    this.headers.push({
                        type: 'boundary ' ,
                        originalComponent: l.type.typeName.escapedText ,
                        aliasComponent: l.name.escapedText
                    });
                }
            });
        }
        if (ts.SyntaxKind[node.kind] === 'ClassDeclaration') {
            const l = JSON.parse(JSON.stringify(node));
            this.headers.push({
                type: 'actor ' ,
                originalComponent:  l.name.escapedText ,
                aliasComponent:  l.name.escapedText
            });
            this.component = l.name.escapedText;
        }
        if (ts.SyntaxKind[node.kind] === 'PropertyDeclaration') {
            // Somente em atividades
        }
        if (ts.SyntaxKind[node.kind] === 'MethodDeclaration') {
            const l = JSON.parse(JSON.stringify(node));
            const xx: ts.MethodDeclaration = node as ts.MethodDeclaration;
            const p = l.name.escapedText;
            this.loga(false,['l.name.escapedText=',l.name.escapedText]);
            const tt = this.headers.find(x => x.originalComponent === this.component);
            this.metodoAtual = p;

            this.novaEstrutura.push({
                componente: tt && tt.aliasComponent ? tt.aliasComponent : this.component,
                metodo: p,
                chamadas: [] as Sequencia[]
            });
            if (this.componentMethods.includes(p)) {
                this.verificaChamadas(node, this.component);
            }else{
                this.loga(false,['SALCI',p]);

            }

        }
        if (ts.SyntaxKind[node.kind] === 'ThisDeclaration' || ts.SyntaxKind[node.kind] === 'PropertyAccessExpression') {
            const hh : ts.PropertyAccessExpression = node as ts.PropertyAccessExpression;
            const paraJson =    JSON.parse(JSON.stringify(hh));
            const prop = hh.name.escapedText;
            // se tem 3 nivel de propriedade (this.variavel.metodo)
            //  se 2o nivel é um dos componentes com alias (variavel === componente)
            //    cria referencia ao componente e metodo
            //  senao
            //    coloca referencia ao metodo local
            // senao (this.variavel)
            //  coloca referencia a variavel local
            if(paraJson['expression'] ){
                if(paraJson['expression']['name'] ){
                    this.loga(false,['[TEMOSALGOAQUI]',paraJson['name']['escapedText']]);
                    const finalCall = paraJson['name']['escapedText'];
                    if(hh.expression){
                        const pp = this.novaEstrutura.findIndex(x => x.componente === this.component && x.metodo === this.metodoAtual);
                        this.novaEstrutura[pp].chamadas.push({
                            componente: paraJson['expression']['name']['escapedText'],
                            metodo: finalCall,
                            chamadas: [] as Sequencia[]
                        } as Sequencia);
                        this.loga(false,['this.novaEstrutura[pp].chamadas=',this.novaEstrutura[pp].chamadas]);
                        this.loga(false,[paraJson['expression']['name']['escapedText']])
                        const h4 : ts.PropertyAccessExpression = hh.expression  as ts.PropertyAccessExpression;
                        // this.loga(false,['[TEMOSALGOAQUI]',h4.getFullText(this.sc)]);
                    }
                }
            }
        }
        if(ts.SyntaxKind[node.kind] === 'VariableDeclaration') {
            const lcd : ts.VariableDeclaration = node as ts.VariableDeclaration;
            node.forEachChild(fiote => {
                if(ts.SyntaxKind[fiote.kind] === 'NewExpression'){
                    const b : ts.Identifier = lcd.name as ts.Identifier;
                    const nomeAmigavel =  b.escapedText.toString();
                    const paragua : ts.NewExpression = fiote as ts.NewExpression;
                    const prop: ts.Identifier = paragua.expression as ts.Identifier;
                    let c = '';
                    if (prop && prop.escapedText){
                        c = prop.escapedText.toString() ;
                    }

                    this.headers.push({
                        type: 'boundary ' ,
                        originalComponent: c ,
                        aliasComponent: nomeAmigavel
                    })
                }
            })


        }


        // this.indent++;
        node.forEachChild(x => {
            this.exibe(x);
        })

    }
    verificaChamadas(no: ts.Node, metodo: string, indice: number = 0) {
        this.loga(false,['verificaChamadas', metodo]);
        //console.log('verificaChamadas',  metodo);
        ts.forEachChild(no, noFilho => {
            if (ts.SyntaxKind[noFilho.kind] === 'PropertyAccessExpression') {
                this.loga(false,['cheguei no ', metodo]);
                const hh : ts.PropertyAccessExpression = noFilho as ts.PropertyAccessExpression;
                const prop = hh.name.escapedText;
                const pp = this.novaEstrutura.findIndex(x => x.componente === this.component && x.metodo === this.metodoAtual);
                this.novaEstrutura[pp]?.chamadas?.push({
                    componente: metodo,
                    metodo: prop,
                    chamadas: [] as Sequencia[]
                } as Sequencia);

            }

            this.verificaChamadas(noFilho, metodo, indice);
        });

    }
    loga(fg = true, ...args: any[]){
        if (fg) console.log(...args)
    }



}





