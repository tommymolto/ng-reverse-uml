import { join } from 'path';
import { WorkspaceSymbols } from 'ngast';
import * as ts from 'typescript';
const fs = require('fs');
import type Elemento from './models/Elemento';
const config = join(process.cwd(), 'tsconfig.json');
const workspace = new WorkspaceSymbols(config);
const modules = workspace.getAllModules();
const components = workspace.getAllComponents();
const directives = workspace.getAllDirectives();
const injectables = workspace.getAllInjectable();
const pipes = workspace.getAllPipes();
// console.log(components.rootNames);
// console.log(components.rootNames);
// console.log(process.cwd() + '\\example\\extrato-anual.component.ts');

const diretorioArquivo = '\\example';
const nomeArquivo =  diretorioArquivo + '\\extrato-anual.component.ts'
const file = process.cwd() + nomeArquivo;
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

function print(node: ts.Node) {


    if(ts.SyntaxKind[node.kind] === 'Constructor') {
        ts.forEachChild(node, x => {
            if (ts.SyntaxKind[x.kind] === 'Parameter') {
                const l = JSON.parse(JSON.stringify(x));
                headers.push({
                    type: 'boundary ' ,
                    originalComponent: l.type.typeName.escapedText ,
                    aliasComponent: l.name.escapedText
                });
            }
        });
    }
    if (ts.SyntaxKind[node.kind] === 'ClassDeclaration') {
        const l = JSON.parse(JSON.stringify(node));
        headers.push({
            type: 'actor ' ,
            originalComponent:  l.name.escapedText ,
            aliasComponent:  l.name.escapedText
        });
        component = l.name.escapedText;
    }
    if (ts.SyntaxKind[node.kind] === 'PropertyDeclaration') {
        // Somente em atividades
    }
    if (ts.SyntaxKind[node.kind] === 'MethodDeclaration') {
        const l = JSON.parse(JSON.stringify(node));
        const xx: ts.MethodDeclaration = node as ts.MethodDeclaration;
        const p = l.name.escapedText;
        console.log('l.name.escapedText=',l.name.escapedText);
        if (componentMethods.includes(p)) {
            methods.push(component + '->' + component + ' : ' + p);

            verificaChamadas(node, component);
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
                console.log('[2TEMOSALGOAQUI]',paraJson['name']['escapedText']);
                const finalCall = paraJson['name']['escapedText'];
                if(hh.expression){
                    methods.push(component + '->' + paraJson['expression']['name']['escapedText'] + ' : ' + finalCall);
                    console.log(paraJson['expression']['name']['escapedText'])
                    const h4 : ts.PropertyAccessExpression = hh.expression  as ts.PropertyAccessExpression;
                    console.log('[4TEMOSALGOAQUI]',h4.getFullText(sc));
                }
                const isComponent = headers.find( x => x.aliasComponent === prop);
                if (isComponent){
                    console.log('FOUND=',prop);
                    const xpFilho = JSON.parse(JSON.stringify(hh))
                    if (xpFilho) console.log('[EXCFILHO]' + prop + '=>', JSON.stringify(xpFilho));
                }else{
                    console.log('SALCI FUFUs');

                }
            }
            // if (paraJson['expression'] && paraJson['expression']) console.log('[TEMOSALGOAQUI]',paraJson['expression'])
        }

        /*const isComponent = headers.find( x => x.aliasComponent === prop);
        console.log('[Olha o this!!!]', JSON.stringify(node));
        console.log('[VERSAO PAE]', JSON.stringify(hh));
        console.log('ts.SyntaxKind[node.kind]=',ts.SyntaxKind[node.kind]);
        console.log('isComponent=',isComponent);
        if (isComponent){
          console.log('FOUND=',prop);
          const xpFilho = JSON.parse(JSON.stringify(hh))
          if (xpFilho) console.log('[EXCFILHO]', JSON.stringify(xpFilho));
        }   */
    }
    indent++;
    ts.forEachChild(node, print);
    indent--;
}
function verificaChamadas(no: ts.Node, metodo: string) {
    // console.log("[filhos de " + metodo,"]:")
    ts.forEachChild(no, noFilho => {
        // console.log('[PPP]:', JSON.stringify(noFilho));
        if (ts.SyntaxKind[noFilho.kind] === 'PropertyAccessExpression') {
            const hh : ts.PropertyAccessExpression = noFilho as ts.PropertyAccessExpression;
            const prop = hh.name.escapedText;
            const isComponent = headers.find( x => x.aliasComponent === prop);
            console.log('isComponent=',isComponent);
            // const pp : ts.SyntaxKind.ThisKeyword = hh.expression as ts.SyntaxKind.ThisKeyword;


            methods.push(metodo + '->' + metodo + ' : ' + hh.name.escapedText);

            // console.log('chamou ' + xxx, JSON.parse(JSON.stringify(no)));
        }
        verificaChamadas(noFilho, metodo);
    });
}
ts.forEachChild(sc, x => {
    // console.log(x);
    print(x);

})
console.log('headers', headers);
console.log('methods', methods);


