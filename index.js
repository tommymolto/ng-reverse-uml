"use strict";
exports.__esModule = true;
var path_1 = require("path");
var ngast_1 = require("ngast");
var ts = require("typescript");
var fs = require('fs');
var config = path_1.join(process.cwd(), 'tsconfig.json');
var workspace = new ngast_1.WorkspaceSymbols(config);
var modules = workspace.getAllModules();
var components = workspace.getAllComponents();
var directives = workspace.getAllDirectives();
var injectables = workspace.getAllInjectable();
var pipes = workspace.getAllPipes();
// console.log(components.rootNames);
// console.log(components.rootNames);
// console.log(process.cwd() + '\\example\\extrato-anual.component.ts');
var diretorioArquivo = '\\example';
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
function print(node) {
    if (ts.SyntaxKind[node.kind] === 'Constructor') {
        ts.forEachChild(node, function (x) {
            if (ts.SyntaxKind[x.kind] === 'Parameter') {
                var l = JSON.parse(JSON.stringify(x));
                headers.push({
                    type: 'boundary ',
                    originalComponent: l.type.typeName.escapedText,
                    aliasComponent: l.name.escapedText
                });
            }
        });
    }
    if (ts.SyntaxKind[node.kind] === 'ClassDeclaration') {
        var l = JSON.parse(JSON.stringify(node));
        headers.push({
            type: 'actor ',
            originalComponent: l.name.escapedText,
            aliasComponent: l.name.escapedText
        });
        component = l.name.escapedText;
    }
    if (ts.SyntaxKind[node.kind] === 'PropertyDeclaration') {
        // Somente em atividades
    }
    if (ts.SyntaxKind[node.kind] === 'MethodDeclaration') {
        var l = JSON.parse(JSON.stringify(node));
        var xx = node;
        var p = l.name.escapedText;
        console.log('l.name.escapedText=', l.name.escapedText);
        if (componentMethods.includes(p)) {
            methods.push(component + '->' + component + ' : ' + p);
            verificaChamadas(node, component);
            // methods.push(component + '<-' + component + ' : ' + p);
        }
    }
    if (ts.SyntaxKind[node.kind] === 'ThisDeclaration' || ts.SyntaxKind[node.kind] === 'PropertyAccessExpression') {
        var hh = node;
        var paraJson = JSON.parse(JSON.stringify(hh));
        var prop_1 = hh.name.escapedText;
        // se tem 3 nivel de propriedade (this.variavel.metodo)
        //  se 2o nivel é um dos componentes com alias (variavel === componente)
        //    cria referencia ao componente e metodo
        //  senao 
        //    coloca referencia ao metodo local
        // senao (this.variavel)
        //  coloca referencia a variavel local
        if (paraJson['expression']) {
            if (paraJson['expression']['name']) {
                // console.log('[2TEMOSALGOAQUI]',paraJson['expression']);
                //console.log('[3TEMOSALGOAQUI]',hh.getFullText(sc));
                console.log('[2TEMOSALGOAQUI]', paraJson['name']['escapedText']);
                var finalCall = paraJson['name']['escapedText'];
                if (hh.expression) {
                    methods.push(component + '->' + paraJson['expression']['name']['escapedText'] + ' : ' + finalCall);
                    console.log(paraJson['expression']['name']['escapedText']);
                    var h4 = hh.expression;
                    console.log('[4TEMOSALGOAQUI]', h4.getFullText(sc));
                }
                var isComponent = headers.find(function (x) { return x.aliasComponent === prop_1; });
                if (isComponent) {
                    console.log('FOUND=', prop_1);
                    var xpFilho = JSON.parse(JSON.stringify(hh));
                    if (xpFilho)
                        console.log('[EXCFILHO]' + prop_1 + '=>', JSON.stringify(xpFilho));
                }
                else {
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
function verificaChamadas(no, metodo) {
    // console.log("[filhos de " + metodo,"]:")
    ts.forEachChild(no, function (noFilho) {
        // console.log('[PPP]:', JSON.stringify(noFilho));
        if (ts.SyntaxKind[noFilho.kind] === 'PropertyAccessExpression') {
            var hh = noFilho;
            var prop_2 = hh.name.escapedText;
            var isComponent = headers.find(function (x) { return x.aliasComponent === prop_2; });
            console.log('isComponent=', isComponent);
            // const pp : ts.SyntaxKind.ThisKeyword = hh.expression as ts.SyntaxKind.ThisKeyword;
            methods.push(metodo + '->' + metodo + ' : ' + hh.name.escapedText);
            // console.log('chamou ' + xxx, JSON.parse(JSON.stringify(no)));
        }
        verificaChamadas(noFilho, metodo);
    });
}
ts.forEachChild(sc, function (x) {
    // console.log(x);
    print(x);
});
console.log('headers', headers);
console.log('methods', methods);
