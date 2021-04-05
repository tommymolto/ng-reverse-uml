"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
var ts = require("typescript");
var path_1 = require("path");
var generateSequence_1 = require("./generateSequence");
var salvaPUML_1 = require("./salvaPUML");
var tipouml_1 = require("./models/tipouml");
var helpers_1 = require("./utils/helpers");
var fs = require('fs');
var programa = require('commander');
var helpers = new helpers_1.default();
var config = path_1.join(process.cwd(), 'tsconfig.json');
var pkg = require('../package.json');
// console.log(components.rootNames);
// console.log(components.rootNames);
// console.log(process.cwd() + '\\example\\extrato-anual.component.ts');
var diretorioArquivo = '/example';
var nomeArquivo = diretorioArquivo + '/extrato-anual.component.ts';
var file = process.cwd() + nomeArquivo;
var program = ts.createProgram([file], { allowJs: true });
var sc = program.getSourceFile(file);
var indent = 0;
var usuario = 'Usuario';
var component = '';
var headers = [];
var properties = [];
var methods = [];
var componentMethods = ['ngOnInit'];
var Application = /** @class */ (function () {
    function Application() {
        this.listaArq = [];
        this.debuga = false;
    }
    Application.prototype.inicia = function (fonte, loga) {
        this.debuga = loga ? true : false;
        var dir = '/' + fonte;
        console.log('vamos em ' + dir);
        // process.exit();
        this.listaArq = this.getAllFiles(dir, []);
        helpers.loga(false, ['geraremos', this.listaArq]);
        this.geraUmlSequenciaPorArquivo(this.listaArq);
    };
    Application.prototype.geraUmlSequenciaPorArquivo = function (arF) {
        for (var _i = 0, arF_1 = arF; _i < arF_1.length; _i++) {
            var arquivo = arF_1[_i];
            helpers.loga(this.debuga, ['Gerando PUML para ' + arquivo.diretorio + arquivo.arquivo]);
            var puml = new generateSequence_1.default(arquivo);
            helpers.loga(this.debuga, ['novaEstrutura=', JSON.stringify(puml.novaEstrutura)]);
            var arqpuml = new salvaPUML_1.default(arquivo, puml.headers, puml.methods, puml.novaEstrutura);
            arqpuml.montaSequencia();
            arqpuml.salvaArquivo(tipouml_1.Tipouml.Sequencia);
        }
    };
    Application.prototype.getAllFiles = function (dirPath, arrayOfFiles) {
        var _this = this;
        helpers.loga(this.debuga, ['dir:', process.cwd() + dirPath]);
        var files = fs.readdirSync(process.cwd() + dirPath);
        arrayOfFiles = arrayOfFiles || [];
        files.forEach(function (file) {
            helpers.loga(_this.debuga, [process.cwd() + dirPath + "/" + file]);
            if (fs.statSync(process.cwd() + dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = _this.getAllFiles(dirPath + "/" + file, arrayOfFiles);
            }
            else {
                // @ts-ignore
                if (file.endsWith('.ts')) {
                    helpers.loga(_this.debuga, ['info:', process.cwd(), dirPath]);
                    arrayOfFiles.push({
                        diretorio: path_1.join(process.cwd(), dirPath, "/"),
                        arquivo: file
                    });
                }
            }
        });
        return arrayOfFiles;
    };
    Object.defineProperty(Application.prototype, "application", {
        get: function () {
            return this;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "isCLI", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    return Application;
}());
exports.Application = Application;
