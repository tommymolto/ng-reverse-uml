"use strict";
exports.__esModule = true;
var path_1 = require("path");
// import { WorkspaceSymbols } from 'ngast';
var ts = require("typescript");
var fs = require('fs');
var config = path_1.join(process.cwd(), 'tsconfig.json');
var generateSequence = /** @class */ (function () {
    function generateSequence(arq) {
        var _this = this;
        // public indent: number = 0;
        this.usuario = 'Usuario';
        this.component = '';
        this.headers = [];
        this.properties = [];
        this.methods = [];
        this.componentMethods = ['ngOnInit'];
        this.uml = '@startuml' +
            ' autoactivate on ' +
            ' participant participant as Usuario';
        this.diretorioArquivo = '/example';
        this.nomeArquivo = this.diretorioArquivo + '/extrato-anual.component.ts';
        this.diretorioArquivo = arq.diretorio;
        this.nomeArquivo = this.diretorioArquivo + arq.arquivo;
        var file = process.cwd() + this.nomeArquivo;
        this.loga(false, ['file: ', this.nomeArquivo]);
        this.program = ts.createProgram([this.nomeArquivo], { allowJs: true });
        this.sc = this.program.getSourceFile(this.nomeArquivo);
        this.loga(false, ['lendo ', this.sc]);
        // @ts-ignore
        ts.forEachChild(this.sc, function (x) {
            // console.log(x);
            _this.exibe(x);
        });
        this.loga(true, ['headers', this.headers]);
        this.loga(true, ['methods', this.methods]);
    }
    generateSequence.prototype.exibe = function (node) {
        var _this = this;
        this.loga(false, ['exibe', node]);
        if (ts.SyntaxKind[node.kind] === 'Constructor') {
            ts.forEachChild(node, function (x) {
                if (ts.SyntaxKind[x.kind] === 'Parameter') {
                    var l = JSON.parse(JSON.stringify(x));
                    _this.headers.push({
                        type: 'boundary ',
                        originalComponent: l.type.typeName.escapedText,
                        aliasComponent: l.name.escapedText
                    });
                }
            });
        }
        if (ts.SyntaxKind[node.kind] === 'ClassDeclaration') {
            var l = JSON.parse(JSON.stringify(node));
            this.headers.push({
                type: 'actor ',
                originalComponent: l.name.escapedText,
                aliasComponent: l.name.escapedText
            });
            this.component = l.name.escapedText;
        }
        if (ts.SyntaxKind[node.kind] === 'PropertyDeclaration') {
            // Somente em atividades
        }
        if (ts.SyntaxKind[node.kind] === 'MethodDeclaration') {
            var l = JSON.parse(JSON.stringify(node));
            var xx = node;
            var p = l.name.escapedText;
            this.loga(false, ['l.name.escapedText=', l.name.escapedText]);
            if (this.componentMethods.includes(p)) {
                // @ts-ignore
                this.methods.push(this.component + "->" + this.component + " : " + p);
                //this.metodo = this.component;
                this.verificaChamadas(node, this.component);
                //this.methods.push('deactivate '+ this.component);
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
                    this.loga(false, ['[2TEMOSALGOAQUI]', paraJson['name']['escapedText']]);
                    var finalCall = paraJson['name']['escapedText'];
                    if (hh.expression) {
                        // @ts-ignore
                        this.methods.push(this.component + "->" + paraJson['expression']['name']['escapedText'] + " : " + finalCall);
                        this.loga(false, [paraJson['expression']['name']['escapedText']]);
                        var h4 = hh.expression;
                        this.loga(false, ['[4TEMOSALGOAQUI]', h4.getFullText(this.sc)]);
                    }
                    var isComponent = this.headers.find(function (x) { return x.aliasComponent === prop_1; });
                    if (isComponent) {
                        this.loga(false, ['FOUND=', prop_1]);
                        var xpFilho = JSON.parse(JSON.stringify(hh));
                        if (xpFilho)
                            this.loga(false, ['[EXCFILHO]' + prop_1 + '=>', JSON.stringify(xpFilho)]);
                    }
                    else {
                        this.loga(false, ['SALCI FUFUs']);
                    }
                }
            }
        }
        // this.indent++;
        node.forEachChild(function (x) {
            _this.exibe(x);
        });
        // ts.forEachChild(node, this.exibe);
        // this.indent--;
    };
    generateSequence.prototype.verificaChamadas = function (no, metodo, indice) {
        var _this = this;
        if (indice === void 0) { indice = 0; }
        // console.log("[filhos de " + metodo,"]:")
        ts.forEachChild(no, function (noFilho) {
            // console.log('[PPP]:', JSON.stringify(noFilho));
            if (ts.SyntaxKind[noFilho.kind] === 'PropertyAccessExpression') {
                indice++;
                var hh = noFilho;
                var prop_2 = hh.name.escapedText;
                _this.loga(true, ['isComponent?=', prop_2]);
                var isComponent = _this.headers.find(function (x) { return x.aliasComponent === prop_2; });
                _this.loga(true, ['isComponent=', isComponent]);
                // const pp : ts.SyntaxKind.ThisKeyword = hh.expression as ts.SyntaxKind.ThisKeyword;
                // @ts-ignore
                _this.methods.push(metodo + '->' + metodo + ' : ' + hh.name.escapedText);
                // console.log('chamou ' + xxx, JSON.parse(JSON.stringify(no)));
            }
            _this.verificaChamadas(noFilho, metodo, indice);
        });
        // if (indice > 0) this.methods.push('deactivate '+ metodo);
    };
    generateSequence.prototype.loga = function (fg) {
        if (fg === void 0) { fg = true; }
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (fg)
            console.log.apply(console, args);
    };
    generateSequence.prototype.salvaSequencia = function (headers, metodos) {
    };
    return generateSequence;
}());
exports["default"] = generateSequence;
