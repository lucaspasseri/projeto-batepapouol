entrarNaSala();
const seletorChat = document.querySelector(".chat ul");
//buscarMensagens();
const meuIntervalo = setInterval(buscarMensagens, 3000);

function entrarNaSala(){
    const usuario = prompt("Qual é o seu nick?");
    const dados = {name: usuario};
    const requisicao = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", dados);
    requisicao.then(processarRequisicaoEntrarNaSala);
    requisicao.catch(processarFalhaEntrarNaSala);
}
function processarRequisicaoEntrarNaSala(resposta){
    let conexao = resposta.config.data.replace(/"/g,'');
    conexao = conexao.replace('{name:', '');
    conexao = conexao.replace('}', '');
    manterConexao(conexao);
}
function processarFalhaEntrarNaSala(falha){
    if(falha.response.status === 400){
        console.log("Erro:400-Falha ao entrar na sala");
        entrarNaSalaNovaTentativa();
    } else {
        console.log("outro-Falha ao entrar na sala");
    }
}

function entrarNaSalaNovaTentativa(){
    const usuario = prompt("Digite outro nick, pois este já esta em uso:");
    const dados = {name: usuario};
    const requisicao = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", dados);
    requisicao.then(processarRequisicaoEntrarNaSalaNovaTentativa);
    requisicao.catch(processarFalhaEntrarNaSalaNovaTentativa);
}
function processarRequisicaoEntrarNaSalaNovaTentativa(resposta){
    let conexao = resposta.config.data.replace(/"/g,'');
    conexao = conexao.replace('{name:', '');
    conexao = conexao.replace('}', '');
    manterConexao(conexao);
}
function processarFalhaEntrarNaSalaNovaTentativa(falha){
    if(falha.response.status === 400){
        console.log("Erro:400-Falha entrar na sala nova tentantiva");
        entrarNaSalaNovaTentativa();
    } else {
        console.log("outro-Falha entrar na sala nova tentantiva");
    }
}

function manterConexao(conexao){
    const dados = {name: conexao};
    const requisicao = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", dados);
    requisicao.then(processarRequisicaoManterConexao);
    requisicao.catch(processarFalhaManterConexao);
}

function processarRequisicaoManterConexao(resposta){
    let conexao = resposta.config.data.replace(/"/g,'');
    conexao = conexao.replace('{name:', '');
    conexao = conexao.replace('}', '');
    setTimeout(manterConexao, 5000, conexao);
}
function processarFalhaManterConexao(falha){
    if(falha.response.status === 400){
        console.log("Erro:400-Falha na manutenção da conexao");
    } else {
        console.log("outro-Falha na manutenção da conexao");
    }
}

function buscarMensagens(){
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages");

    promessa.then(processarResposta);
    promessa.catch(processarFalha);
}
function processarResposta(resposta){
    exibirMensagens(resposta.data);
}

function processarFalha(falha){
    if(falha.response.status === 400){
        console.log("Erro:400-4");
    }
}

function exibirMensagens(listaDeMensagens){
    seletorChat.innerHTML = "";
    for(let i = 0; i < listaDeMensagens.length; i++){
        if(listaDeMensagens[i].type === "private_message"){
            seletorChat.innerHTML += 
                `<li>
                    <p>
                        <span class="time">(${listaDeMensagens[i].time})</span>
                        <span class="from">${listaDeMensagens[i].from}</span>
                        reservadamente para <span class="to">${listaDeMensagens[i].to}:</span>
                        <span class="text">${listaDeMensagens[i].text}</span>
                    </p>
                </li>`;
            seletorChat.lastChild.style.backgroundColor = "#ffdede";
            window.scrollTo(0,document.querySelector(".chat").scrollHeight);
        } else if (listaDeMensagens[i].type === "status") {
            seletorChat.innerHTML += 
                `<li class="status">
                    <p>
                        <span class="time">(${listaDeMensagens[i].time})</span>
                        <span class="from">${listaDeMensagens[i].from}</span>
                        <span class="text">${listaDeMensagens[i].text}</span>
                    </p>
                </li>`;
                seletorChat.lastChild.style.backgroundColor = "#dcdcdc";
                window.scrollTo(0,document.querySelector(".chat").scrollHeight);
        } else {
            seletorChat.innerHTML += 
            `<li class="message">
                <p>
                    <span class="time">(${listaDeMensagens[i].time})</span>
                    <span class="from">${listaDeMensagens[i].from}</span>
                    para <span class="to">${listaDeMensagens[i].to}</span>:
                    <span class="text">${listaDeMensagens[i].text}</span>
                </p>
            </li>`;  
            window.scrollTo(0,document.querySelector(".chat").scrollHeight); 
        }
    }
}