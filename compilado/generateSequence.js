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
        this.contagemMetodos = 0;
        this.cores = ['#005500', '#0055FF', '#0055F0', '#00FF00', '#0055F0'];
        this.methods = [];
        this.componentMethods = ['ngOnInit'];
        this.uml = '@startuml' +
            ' autoactivate on ' +
            ' participant participant as Usuario';
        this.diretorioArquivo = '';
        this.nomeArquivo = '';
        this.novaEstrutura = [];
        this.metodoAtual = '';
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
        this.loga(false, ['headers', this.headers]);
        // this.loga(true,['methods', this.methods]);
        this.loga(true, ['novaEstrutura', this.novaEstrutura]);
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
            this.loga(true, ['l.name.escapedText=', l.name.escapedText]);
            var tt = this.headers.find(function (x) { return x.originalComponent === _this.component; });
            this.metodoAtual = p;
            this.novaEstrutura.push({
                componente: tt && tt.aliasComponent ? tt.aliasComponent : this.component,
                metodo: p,
                chamadas: []
            });
            if (this.componentMethods.includes(p)) {
                //this.contagemMetodos++;
                // @ts-ignore
                this.methods.push(this.component + "->" + this.component + " " + this.cores[this.contagemMetodos] + ": " + p);
                //this.metodo = this.component;
                this.verificaChamadas(node, this.component);
                //this.methods.push('deactivate '+ this.component);
                // methods.push(component + '<-' + component + ' : ' + p);
            }
            else {
                console.log('SALCI', p);
                // this.verificaChamadas(node, this.component);
                this.methods.push(this.usuario + "->" + this.component + " " + this.cores[this.contagemMetodos] + ": " + p);
            }
        }
        if (ts.SyntaxKind[node.kind] === 'ThisDeclaration' || ts.SyntaxKind[node.kind] === 'PropertyAccessExpression') {
            var hh = node;
            var paraJson = JSON.parse(JSON.stringify(hh));
            var prop = hh.name.escapedText;
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
                        var pp = this.novaEstrutura.findIndex(function (x) { return x.componente === _this.component && x.metodo === _this.metodoAtual; });
                        /*console.log('indice',pp);
                        console.log('add',{
                            componente: paraJson['expression']['name']['escapedText'],
                            metodo: finalCall
                        });*/
                        this.novaEstrutura[pp].chamadas.push({
                            componente: paraJson['expression']['name']['escapedText'],
                            metodo: finalCall
                        });
                        console.log('this.novaEstrutura[pp].chamadas=', this.novaEstrutura[pp].chamadas);
                        // @ts-ignore
                        this.methods.push(this.component + "->" + paraJson['expression']['name']['escapedText'] + " : " + finalCall);
                        this.loga(false, [paraJson['expression']['name']['escapedText']]);
                        var h4 = hh.expression;
                        this.loga(false, ['[4TEMOSALGOAQUI]', h4.getFullText(this.sc)]);
                    }
                    else {
                        console.log('ERRO', finalCall);
                    }
                    /*const isComponent = this.headers.find( x => x.aliasComponent === prop);
                    if (isComponent){
                        this.loga(false,['FOUND=',prop]);
                        const xpFilho = JSON.parse(JSON.stringify(hh))
                        if (xpFilho) this.loga(false, ['[EXCFILHO]' + prop + '=>', JSON.stringify(xpFilho)]);
                    }else{
                        this.loga(false, ['SALCI FUFUs']);

                    }*/
                }
            }
        }
        // this.indent++;
        node.forEachChild(function (x) {
            _this.exibe(x);
        });
    };
    generateSequence.prototype.verificaChamadas = function (no, metodo, indice) {
        var _this = this;
        if (indice === void 0) { indice = 0; }
        console.log('verificaChamadas', metodo);
        ts.forEachChild(no, function (noFilho) {
            if (ts.SyntaxKind[noFilho.kind] === 'PropertyAccessExpression') {
                console.log('cheguei no ', metodo);
                var hh = noFilho;
                var prop = hh.name.escapedText;
                var pp = _this.novaEstrutura.findIndex(function (x) { return x.componente === _this.component && x.metodo === _this.metodoAtual; });
                _this.novaEstrutura[pp].chamadas.push({
                    componente: metodo,
                    metodo: prop
                });
                // @ts-ignore
                _this.methods.push(metodo + '->' + metodo + ' : ' + hh.name.escapedText);
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
