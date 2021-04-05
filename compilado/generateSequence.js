"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
// import { WorkspaceSymbols } from 'ngast';
var ts = require("typescript");
var fs = require('fs');
var config = path_1.join(process.cwd(), 'tsconfig.json');
var generateSequence = /** @class */ (function () {
    function generateSequence(arq, loga) {
        var _this = this;
        if (loga === void 0) { loga = false; }
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
        this.debuga = false;
        this.debuga = loga ? true : false;
        this.diretorioArquivo = arq.diretorio;
        this.nomeArquivo = this.diretorioArquivo + arq.arquivo;
        var file = process.cwd() + this.nomeArquivo;
        this.loga(this.debuga, ['file: ', this.nomeArquivo]);
        this.program = ts.createProgram([this.nomeArquivo], { allowJs: true });
        this.sc = this.program.getSourceFile(this.nomeArquivo);
        var printer = ts.createPrinter();
        console.log(printer.printFile(this.sc));
        this.loga(this.debuga, ['lendo ', this.sc]);
        // @ts-ignore
        ts.forEachChild(this.sc, function (x) {
            // console.log(x);
            _this.exibe(x);
        });
        this.loga(this.debuga, ['headers', this.headers]);
        // this.loga(false,['methods', this.methods]);
        this.loga(this.debuga, ['novaEstrutura', this.novaEstrutura]);
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
            this.loga(this.debuga, ['l.name.escapedText=', l.name.escapedText]);
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
                this.loga(this.debuga, ['SALCI', p]);
            }
        }
        if (ts.SyntaxKind[node.kind] === 'ThisDeclaration' || ts.SyntaxKind[node.kind] === 'PropertyAccessExpression') {
            var hh = node;
            var paraJson_1 = JSON.parse(JSON.stringify(hh));
            var prop = hh.name.escapedText;
            // se tem 3 nivel de propriedade (this.variavel.metodo)
            //  se 2o nivel é um dos componentes com alias (variavel === componente)
            //    cria referencia ao componente e metodo
            //  senao
            //    coloca referencia ao metodo local
            // senao (this.variavel)
            //  coloca referencia a variavel local
            if (paraJson_1['expression']) {
                this.loga(this.debuga, ['PropertyAccessExpression', paraJson_1]);
                if (paraJson_1['expression']['name']) {
                    var finalCall = paraJson_1['name']['escapedText'];
                    if (hh.expression) {
                        var pp = this.novaEstrutura.findIndex(function (x) { return x.componente === _this.component && x.metodo === _this.metodoAtual; });
                        this.loga(this.debuga, ['is this it?', pp]);
                        this.loga(this.debuga, ['this.novaEstrutura[' + pp + ' ].chamadas=', {
                                componente: paraJson_1['expression']['name']['escapedText'],
                                metodo: finalCall,
                                chamadas: []
                            }]);
                        try {
                            this.novaEstrutura[pp].chamadas.push({
                                componente: paraJson_1['expression']['name']['escapedText'],
                                metodo: finalCall,
                                chamadas: []
                            });
                            this.loga(this.debuga, ['this.novaEstrutura[pp].chamadas=', this.novaEstrutura[pp].chamadas]);
                            this.loga(this.debuga, ['parajson', paraJson_1['expression']['name']['escapedText']]);
                        }
                        catch (e) {
                            console.log('[ERROR]', e);
                        }
                        var h4 = hh.expression;
                        // this.loga(false,['[TEMOSALGOAQUI]',h4.getFullText(this.sc)]);
                    }
                }
                else if (paraJson_1['expression']['escapedText']) {
                    var temNewCall = this.headers.find(function (x) { return x.aliasComponent === paraJson_1['expression']['escapedText']; });
                    if (temNewCall === null || temNewCall === void 0 ? void 0 : temNewCall.aliasComponent) {
                        var pp = this.novaEstrutura.findIndex(function (x) { return x.componente === _this.component && x.metodo === _this.metodoAtual; });
                        var finalCall = paraJson_1['name']['escapedText'];
                        try {
                            this.novaEstrutura[pp].chamadas.push({
                                componente: paraJson_1['expression']['escapedText'],
                                metodo: finalCall,
                                chamadas: []
                            });
                        }
                        catch (e) {
                            console.log('[ERROR]', e);
                        }
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
        /*if(ts.SyntaxKind[node.kind] === 'PropertyAccessExpression') {
            const pae : ts.PropertyAccessExpression = node as ts.PropertyAccessExpression;
            const metodoProperty = pae.name.escapedText.toString();
            this.loga(false,['PropertyAccessExpression', pae.name.escapedText.toString()]);


            node.forEachChild(fiote => {
                if(ts.SyntaxKind[fiote.kind] === 'Identifier'){
                    const pp = this.novaEstrutura.findIndex(x => x.componente === this.component
                        && x.metodo === this.metodoAtual);
                    this.loga(false,['Identifier', fiote]);
                }
            })
            this.loga(false,['PropertyAccessExpression', pae.name.escapedText.toString()]);
            /!*if(ts.SyntaxKind[pae['expression']] === 'Identifier' &&
                ts.SyntaxKind[pae['name']] === 'Identifier'
            ) {
                this.loga(false,['PropertyAccessExpression', pae.expression.escapedText.toString()]);
            }*!/


        }*/
        // this.indent++;
        node.forEachChild(function (x) {
            _this.exibe(x);
        });
    };
    generateSequence.prototype.verificaChamadas = function (no, metodo, indice) {
        var _this = this;
        if (indice === void 0) { indice = 0; }
        this.loga(this.debuga, ['verificaChamadas', metodo]);
        //console.log('verificaChamadas',  metodo);
        ts.forEachChild(no, function (noFilho) {
            var _a, _b;
            if (ts.SyntaxKind[noFilho.kind] === 'PropertyAccessExpression') {
                _this.loga(false, ['cheguei no ', metodo]);
                var hh = noFilho;
                var prop = hh.name.escapedText;
                var pp = _this.novaEstrutura.findIndex(function (x) { return x.componente === _this.component && x.metodo === _this.metodoAtual; });
                try {
                    (_b = (_a = _this.novaEstrutura[pp]) === null || _a === void 0 ? void 0 : _a.chamadas) === null || _b === void 0 ? void 0 : _b.push({
                        componente: metodo,
                        metodo: prop,
                        chamadas: []
                    });
                }
                catch (e) {
                    console.error('[ERROR]', e);
                }
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
exports.default = generateSequence;
