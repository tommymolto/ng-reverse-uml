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
            this.loga(false, ['l.name.escapedText=', l.name.escapedText]);
            var tt = this.headers.find(function (x) { return x.originalComponent === _this.component; });
            this.metodoAtual = p;
            this.novaEstrutura.push({
                componente: tt && tt.aliasComponent ? tt.aliasComponent : this.component,
                metodo: p,
                chamadas: []
            });
            if (this.componentMethods.includes(p)) {
                this.verificaChamadas(node, this.component);
            }
            else {
                this.loga(false, ['SALCI', p]);
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
                    this.loga(false, ['[TEMOSALGOAQUI]', paraJson['name']['escapedText']]);
                    var finalCall = paraJson['name']['escapedText'];
                    if (hh.expression) {
                        var pp = this.novaEstrutura.findIndex(function (x) { return x.componente === _this.component && x.metodo === _this.metodoAtual; });
                        this.novaEstrutura[pp].chamadas.push({
                            componente: paraJson['expression']['name']['escapedText'],
                            metodo: finalCall,
                            chamadas: []
                        });
                        this.loga(false, ['this.novaEstrutura[pp].chamadas=', this.novaEstrutura[pp].chamadas]);
                        this.loga(false, [paraJson['expression']['name']['escapedText']]);
                        var h4 = hh.expression;
                        // this.loga(false,['[TEMOSALGOAQUI]',h4.getFullText(this.sc)]);
                    }
                }
            }
        }
        if (ts.SyntaxKind[node.kind] === 'VariableDeclaration') {
            var lcd_1 = node;
            node.forEachChild(function (fiote) {
                if (ts.SyntaxKind[fiote.kind] === 'NewExpression') {
                    var b = lcd_1.name;
                    var nomeAmigavel = b.escapedText.toString();
                    var paragua = fiote;
                    var prop = paragua.expression;
                    var c = '';
                    if (prop && prop.escapedText) {
                        c = prop.escapedText.toString();
                    }
                    _this.headers.push({
                        type: 'boundary ',
                        originalComponent: c,
                        aliasComponent: nomeAmigavel
                    });
                }
            });
        }
        // this.indent++;
        node.forEachChild(function (x) {
            _this.exibe(x);
        });
    };
    generateSequence.prototype.verificaChamadas = function (no, metodo, indice) {
        var _this = this;
        if (indice === void 0) { indice = 0; }
        this.loga(false, ['verificaChamadas', metodo]);
        //console.log('verificaChamadas',  metodo);
        ts.forEachChild(no, function (noFilho) {
            var _a, _b;
            if (ts.SyntaxKind[noFilho.kind] === 'PropertyAccessExpression') {
                _this.loga(false, ['cheguei no ', metodo]);
                var hh = noFilho;
                var prop = hh.name.escapedText;
                var pp = _this.novaEstrutura.findIndex(function (x) { return x.componente === _this.component && x.metodo === _this.metodoAtual; });
                (_b = (_a = _this.novaEstrutura[pp]) === null || _a === void 0 ? void 0 : _a.chamadas) === null || _b === void 0 ? void 0 : _b.push({
                    componente: metodo,
                    metodo: prop,
                    chamadas: []
                });
            }
            _this.verificaChamadas(noFilho, metodo, indice);
        });
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
    return generateSequence;
}());
exports["default"] = generateSequence;
