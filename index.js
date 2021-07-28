const http = require('http');
const fs = require('fs');

var paginaHTML;
var servidor = http.createServer(funcaoRequestListener);

//decodedURI armazena url da requisição decodificada
//condição verifica se na variável existe "enviaData"; "enviaData" é a requisição feita através do botão na página html
//posicaoDeSeparacao armazena a posição de separação entre a requisição e a informação dela
//dataEmString armazena a informação da requisição
//dataHoje armazena a data de hoje; dataNascimento armazena data da requisição; dataDiferenca faz a subtracao entre ambas
//objeto Date() no javascript e input do tipo datetime-local compartilham o formato da data, por isso é simples jogar de um pro outro
//segundosCorridos, diasCorridos fazem a devida conversão
//textoSaida armazena resposta ao usuário
//$() é pela biblioteca express.js, aparentemente ela expande a possibilidade de construção do html
//if/else finais retornam página html padrão ou informam página html não encontrada
function funcaoRequestListener (req, res) {
  var decodedURI = decodeURI(req.url);

  if(decodedURI.indexOf("enviaData") !== -1) {
    res.writeHead(200, {'Content-Type':'text/plain'});

    var posicaoDeSeparacao = decodedURI.indexOf('$');
    var dataEmString = decodedURI.substring(posicaoDeSeparacao+1);
    /*
    console.log(dataEmString);

    var dataNascimento = {
      ano: Number(dataEmString.substring(0,4)),
      mes: Number(dataEmString.substring(5,7)),
      dia: Number(dataEmString.substring(8,10)),
      hora: Number(dataEmString.substring(11,13)),
      minuto: Number(dataEmString.substring(14,16)),
    }
    */
    var dataHoje = new Date(); dataHoje.setUTCHours(dataHoje.getHours()-3);
    var dataNascimento = new Date(dataEmString);
    var dataDiferenca = dataHoje.getTime() - dataNascimento.getTime();

    var segundosCorridos = parseInt(dataDiferenca/(1000));
    var diasCorridos = parseInt(dataDiferenca/(1000 * 3600 * 24));
    console.log(segundosCorridos, diasCorridos);
    console.log(dataNascimento);
    console.log(dataHoje);


    var textoSaida =
    `
    <p>
    ${
      "então, até a data "+(dataHoje.getDate())+"-"+(dataHoje.getMonth()+1)+"-"+(dataHoje.getFullYear())+", às "+dataHoje.getHours()+":"+dataHoje.getMinutes()+"</br>"+"você viveu cerca de "+segundosCorridos.toLocaleString("pt-BR").bold()+" segundos."
    }
    </p>
    `
    res.end(textoSaida);
  }


  if(req.url == "/"){
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(paginaHTML);
  }else{
    res.writeHead(200, {'Content-Type':'text/plain'});
    res.end("PÁGINA NÃO ENCONTRADA");
  }
}

fs.readFile('base.html', (err, data) => {
  if (err) throw err;
  paginaHTML = data;
  servidor.listen(8080);
});