var fs = require('fs');
function salvaPuml(conteudo, caminho, nome) {
    if (nome === void 0) { nome = 'doc.puml'; }
    var arq = caminho + nome + '.puml';
    fs.writeFile(arq, conteudo, function (err) {
        if (err)
            return console.log(err);
        console.log('Salvo: ' + arq);
    });
}
