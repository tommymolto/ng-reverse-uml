import { join } from 'path';
import { WorkspaceSymbols } from 'ngast';
import * as ts from 'typescript';
const fs = require('fs');
import type Elemento from './models/Elemento';
import Arquivo from "./models/Arquivo";
const config = join(process.cwd(), 'tsconfig.json');

export default class generateSequence {
    private program ;
    private sc ;
    // public indent: number = 0;
    usuario = 'Usuario';
    component = '';
    public headers : Elemento[] = [];
    properties = [];
    public methods = [];
    componentMethods= ['ngOnInit'];
    uml = '@staruml' +
        ' autoactivate on ' +
        ' participant participant as Usuario';
    diretorioArquivo = '\\example';
    nomeArquivo =  this.diretorioArquivo + '\\extrato-anual.component.ts'

    constructor(arq: Arquivo){
        this.diretorioArquivo = arq.diretorio;
        this.nomeArquivo = this.diretorioArquivo + arq.arquivo;
        const file = process.cwd() + this.nomeArquivo;
        this.loga(false, ['file: ',this.nomeArquivo] )

        this.program = ts.createProgram([this.nomeArquivo], { allowJs: true });
        this.sc = this.program.getSourceFile( this.nomeArquivo );
        this.loga(false,['lendo ', this.sc])
        // @ts-ignore
        ts.forEachChild(this.sc, x => {
            // console.log(x);
            this.exibe(x);
        })
        this.loga(true,['headers', this.headers]);
        this.loga(true,['methods', this.methods]);
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
            if (this.componentMethods.includes(p)) {
                // @ts-ignore
                this.methods.push(`${this.component}->${this.component} : ${p}`);

                this.verificaChamadas(node, this.component);
                // methods.push(component + '<-' + component + ' : ' + p);
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
                    // console.log('[2TEMOSALGOAQUI]',paraJson['expression']);
                    //console.log('[3TEMOSALGOAQUI]',hh.getFullText(sc));
                    this.loga(false,['[2TEMOSALGOAQUI]',paraJson['name']['escapedText']]);
                    const finalCall = paraJson['name']['escapedText'];
                    if(hh.expression){
                        // @ts-ignore
                        this.methods.push(`${this.component}->${paraJson['expression']['name']['escapedText']} : ${finalCall}`);
                        this.loga(false,[paraJson['expression']['name']['escapedText']])
                        const h4 : ts.PropertyAccessExpression = hh.expression  as ts.PropertyAccessExpression;
                        this.loga(false,['[4TEMOSALGOAQUI]',h4.getFullText(this.sc)]);
                    }
                    const isComponent = this.headers.find( x => x.aliasComponent === prop);
                    if (isComponent){
                        this.loga(false,['FOUND=',prop]);
                        const xpFilho = JSON.parse(JSON.stringify(hh))
                        if (xpFilho) this.loga(false, ['[EXCFILHO]' + prop + '=>', JSON.stringify(xpFilho)]);
                    }else{
                        this.loga(false, ['SALCI FUFUs']);

                    }
                }
            }
        }
        // this.indent++;
        node.forEachChild(x => {
            this.exibe(x);
        })
        // ts.forEachChild(node, this.exibe);
        // this.indent--;
    }
    verificaChamadas(no: ts.Node, metodo: string) {
        // console.log("[filhos de " + metodo,"]:")
        ts.forEachChild(no, noFilho => {
            // console.log('[PPP]:', JSON.stringify(noFilho));
            if (ts.SyntaxKind[noFilho.kind] === 'PropertyAccessExpression') {
                const hh : ts.PropertyAccessExpression = noFilho as ts.PropertyAccessExpression;
                const prop = hh.name.escapedText;
                const isComponent = this.headers.find( x => x.aliasComponent === prop);
                this.loga(false,['isComponent=',isComponent]);
                // const pp : ts.SyntaxKind.ThisKeyword = hh.expression as ts.SyntaxKind.ThisKeyword;


                // @ts-ignore
                this.methods.push(this.metodo + '->' + this.metodo + ' : ' + hh.name.escapedText);

                // console.log('chamou ' + xxx, JSON.parse(JSON.stringify(no)));
            }
            this.verificaChamadas(noFilho, metodo);
        });
    }
    loga(fg = true, ...args: any[]){
        if (fg) console.log(...args)
    }
    salvaSequencia(headers, metodos){


    }


}





