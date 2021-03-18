"use strict";
exports.__esModule = true;
var tipouml_1 = require("./models/tipouml");
var fs = require('fs');
var SalvaPUML = /** @class */ (function () {
    function SalvaPUML(arquivo, cabecalhos, metodos) {
        if (cabecalhos === void 0) { cabecalhos = []; }
        if (metodos === void 0) { metodos = []; }
        this.cabecalhos = [];
        this.metodos = [];
        this.conteudo = '';
        this.arquivo = arquivo;
        this.cabecalhos = cabecalhos;
        this.metodos = metodos;
    }
    SalvaPUML.prototype.montaSequencia = function () {
        var _this = this;
        this.conteudo = '@startuml \r\n' +
            ' autoactivate on \r\n' +
            ' participant participant as Usuario\r\n';
        this.cabecalhos.forEach(function (cab) {
            _this.conteudo += cab.type + ' ' + cab.originalComponent + ' as ' + cab.aliasComponent + '\r\n';
        });
        this.metodos.forEach(function (linha) {
            _this.conteudo += linha + ' \r\n';
        });
        this.conteudo += '@enduml';
    };
    SalvaPUML.prototype.salvaArquivo = function (tipoUML) {
        if (tipoUML === void 0) { tipoUML = tipouml_1.Tipouml.Sequencia; }
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
