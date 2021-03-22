"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var tipouml_1 = require("./models/tipouml");
var helpers_1 = require("./utils/helpers");
var fs = require('fs');
var SalvaPUML = /** @class */ (function () {
    function SalvaPUML(arquivo, cabecalhos, metodos, estrutura) {
        if (cabecalhos === void 0) { cabecalhos = []; }
        if (metodos === void 0) { metodos = []; }
        if (estrutura === void 0) { estrutura = []; }
        this.cabecalhos = [];
        this.metodos = [];
        this.conteudo = '';
        this.estrutura = [];
        this.metodoAtual = '';
        this.componentetual = '';
        this.cores = ['#005500', '#0055FF', '#0055F0', '#00FF00', '#0055F0'];
        this.arquivo = arquivo;
        this.cabecalhos = cabecalhos;
        this.metodos = metodos;
        this.estrutura = estrutura;
        // console.log('nova=>', this.estrutura);
        this.helpers = new helpers_1["default"]();
    }
    SalvaPUML.prototype.montaSequencia = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.conteudo += '@startuml \r\n' +
                            ' participant participant as Usuario\r\n';
                        this.cabecalhos.forEach(function (cab) {
                            _this.conteudo += cab.type + ' ' + cab.originalComponent + ' as ' + cab.aliasComponent + '\r\n';
                        });
                        return [4 /*yield*/, this.loopSequencia(this.estrutura)];
                    case 1:
                        _a.sent();
                        this.conteudo += '@enduml';
                        return [2 /*return*/];
                }
            });
        });
    };
    SalvaPUML.prototype.loopSequencia = function (structGlobal, caller, indiceGlobal) {
        if (caller === void 0) { caller = 'Usuario'; }
        if (indiceGlobal === void 0) { indiceGlobal = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.helpers.loga(true, ['[indiceGlobal=' + indiceGlobal + ']',
                    JSON.stringify(structGlobal)]);
                structGlobal === null || structGlobal === void 0 ? void 0 : structGlobal.forEach(function (x, indice, objeto) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.conteudo += caller + ' -> ' + x.componente + ':' + x.metodo + '\r\n';
                                this.helpers.loga(true, ['[SAIDA]', caller + ' -> ' + x.componente + ':' + x.metodo + '\r\n']);
                                this.conteudo += 'activate ' + x.componente + ' ' + this.cores[indiceGlobal] + '\r\n';
                                this.helpers.loga(true, ['[SAIDA]', 'activate ' + x.componente + ' ' + this.cores[indiceGlobal] + '\r\n']);
                                return [4 /*yield*/, this.validaChamadas(x, indiceGlobal)];
                            case 1:
                                _a.sent();
                                this.conteudo += 'deactivate ' + x.componente + '\r\n';
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    SalvaPUML.prototype.validaChamadas = function (x, indiceGlobal) {
        var _a;
        if (indiceGlobal === void 0) { indiceGlobal = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                (_a = x.chamadas) === null || _a === void 0 ? void 0 : _a.forEach(function (y, indiceLocal) {
                    var _a;
                    _this.helpers.loga(true, ['Filtro de metodo = ', x.metodo]);
                    var zz = ((_a = _this.estrutura) === null || _a === void 0 ? void 0 : _a.findIndex(function (k) { return k.metodo === y.metodo; })) || 0;
                    _this.helpers.loga(true, ['Indice = ', zz]);
                    // const z = structGlobal?.filter(k => k.metodo === x.metodo);
                    if (zz && zz >= 0) {
                        var t = [];
                        var comp = _this.estrutura[zz].componente;
                        t.push(_this.estrutura[zz]);
                        _this.helpers.loga(true, ['Loop em  = ', t]);
                        indiceGlobal++;
                        _this.estrutura.splice(zz, 1);
                        _this.loopSequencia(t, comp, indiceGlobal);
                    }
                    else {
                        _this.conteudo += x.componente + ' -> ' + y.componente + ':' + y.metodo + '\r\n';
                        _this.helpers.loga(true, ['[SemMetodo][SAIDA]', x.componente + ' -> ' + y.componente + ':' + y.metodo + '\r\n']);
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    SalvaPUML.prototype.salvaArquivo = function (tipoUML) {
        if (tipoUML === void 0) { tipoUML = tipouml_1.Tipouml.Sequencia; }
        this.helpers.loga(true, ['conteudo=', this.conteudo]);
        var f = this.arquivo.diretorio + this.arquivo.arquivo + '.' + tipoUML + '.puml';
        fs.writeFile(f, this.conteudo, function (err) {
            if (err)
                return console.log(err);
            console.log('Generating > ', f);
        });
    };
    return SalvaPUML;
}());
exports["default"] = SalvaPUML;
