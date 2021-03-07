const fs = require('fs');


function salvaPuml(conteudo: string, caminho: string, nome: string = 'doc.puml'){
    const arq  = caminho + nome + '.puml';
    fs.writeFile(arq, conteudo,  (err: any) => {
        if (err) return console.log(err);
        console.log('Salvo: ' +  arq);
    });
}
