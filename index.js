"use strict";
exports.__esModule = true;
var path_1 = require("path");
var ngast_1 = require("ngast");
var ts = require("typescript");
var config = path_1.join(process.cwd(), 'tsconfig.json');
var workspace = new ngast_1.WorkspaceSymbols(config);
var modules = workspace.getAllModules();
var components = workspace.getAllComponents();
var directives = workspace.getAllDirectives();
var injectables = workspace.getAllInjectable();
var pipes = workspace.getAllPipes();
// console.log(components.rootNames);
// console.log(components.rootNames);
var file = 'C:\\Users\\tommy\\Downloads\\csf-canais-digitais-web-extrato-anual-de-tarifas\\csf-canais-digitais-web-extrato-anual-de-tarifas\\projects\\extrato-anual-tarifa\\src\\lib\\components\\extrato-anual\\extrato-anual.component.ts';
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
    'participant participant as Usuario';
function print(node) {
    console.log(new Array(indent + 1).join(' ') + ts.SyntaxKind[node.kind] + '->');
    if (ts.SyntaxKind[node.kind] === 'Constructor') {
        ts.forEachChild(node, function (x) {
            if (ts.SyntaxKind[x.kind] === 'Parameter') {
                var l = JSON.parse(JSON.stringify(x));
                headers.push('boundary ' + l.type.typeName.escapedText + ' as ' + l.name.escapedText);
                // console.log(l);
            }
            // console.log('=>' + new Array(indent + 1).join(' ') + ts.SyntaxKind[x.kind] + '->');
        });
    }
    if (ts.SyntaxKind[node.kind] === 'ClassDeclaration') {
        var l = JSON.parse(JSON.stringify(node));
        headers.push('actor ' + l.name.escapedText + ' as ' + l.name.escapedText);
        component = l.name.escapedText;
        // console.log('classe=', l);
    }
    if (ts.SyntaxKind[node.kind] === 'PropertyDeclaration') {
        // Somente em atividades
    }
    if (ts.SyntaxKind[node.kind] === 'MethodDeclaration') {
        var l = JSON.parse(JSON.stringify(node));
        // console.log('conteudo', l);
        var xx = node;
        // console.log('method', xx.body);
        var p = l.name.escapedText;
        if (componentMethods.includes(p)) {
            methods.push(component + '->' + component + ' : ' + p);
            verificaChamadas(node, xx);
            methods.push(component + '<-' + component + ' : ' + p);
        }
    }
    if (ts.SyntaxKind[node.kind] === 'ThisDeclaration' || ts.SyntaxKind[node.kind] === 'PropertyAccessExpression') {
        // console.log('Olha o this', node)
    }
    indent++;
    ts.forEachChild(node, print);
    indent--;
}
function verificaChamadas(no, metodo) {
    var xxx = metodo.name;
    console.log('filhos de ', xxx.escapedText);
    ts.forEachChild(no, function (x) {
        if (ts.SyntaxKind[x.kind] === 'PropertyAccessExpression') {
            var hh = x;
            // console.log('chamu ' + metodo, JSON.parse(JSON.stringify(no)));
        }
        verificaChamadas(x, metodo);
    });
}
ts.forEachChild(sc, function (x) {
    // console.log(x);
    print(x);
});
console.log('headers', headers);
console.log('methods', methods);
