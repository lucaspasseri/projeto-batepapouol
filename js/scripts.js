entrarNaSala();
const seletorChat = document.querySelector(".chat ul");
//buscarMensagens();
const meuIntervalo = setInterval(buscarMensagens, 3000);
//buscarParticipantes();
const meuSegundoIntervalo = setInterval(buscarParticipantes, 5000);
let superUsuario = null;
let destinatario = null;
let visibilidade = null;


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
    superUsuario = conexao;
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
    superUsuario = conexao;
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
        console.log("Erro:400-Falha ao buscar mensagens");
    }
    else {
        console.log("outro-Falha ao buscar mensagens");
    }
}


function enviarMensagem(){
    const seletorNovaMensagem = document.querySelector(".nova-mensagem input");
    const mensagem = seletorNovaMensagem.value;
    

    if(superUsuario === null){
        superUsuario = "Eu";
    }

    if(destinatario === null){
        destinatario = "Todos";
    }
    if(visibilidade === null){
        visibilidade = "message";
    }
    
    console.log(superUsuario, destinatario);
    console.log(mensagem);
    const dados = {
        from: superUsuario,
        to: destinatario,
        text: mensagem,
        type: visibilidade
    }
    const requisicao = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", dados);

    requisicao.then(processarEnviarMensagem);
    requisicao.catch(processarFalhaEnviarMensagem);
}
function processarEnviarMensagem(resposta){
    buscarMensagens();
}
function processarFalhaEnviarMensagem(falha){
    if(falha.response.status === 400){
        console.log("Erro:400-Falha ao enviar mensagem");
        window.location.reload();
    } else {
        console.log("outro-Falha ao enviar mensagem");
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
            //window.scrollTo(0,document.querySelector(".chat").scrollHeight);
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
                //window.scrollTo(0,document.querySelector(".chat").scrollHeight);
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
            //window.scrollTo(0,document.querySelector(".chat").scrollHeight); 
        }
    }
}

function ativarAbaLateral(){
    const seletorAbaLateral = document.querySelector(".aba-lateral");
    seletorAbaLateral.classList.remove("escondido");
}
function desativarAbaLateral(){
    const seletorAbaLateral = document.querySelector(".aba-lateral");
    seletorAbaLateral.classList.add("escondido");
}

function buscarParticipantes(){
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants");

    promessa.then(processarParticipantes);
    promessa.catch(processarFalhaParticipantes);
}
function processarParticipantes(resposta){
    console.log(resposta.data);
    const seletorSelecaoParticipantes = document.querySelector(".selecao-participantes ul");
    console.log(seletorSelecaoParticipantes);
    let nomeParticipante = destinatario;

    if(nomeParticipante !== null){
        seletorTodosParticipantes = seletorSelecaoParticipantes.querySelectorAll("li");
        console.log(seletorTodosParticipantes);
        console.log(nomeParticipante);
    } else {
        seletorSelecaoParticipantes.innerHTML = `<li onclick="selecionarDestinatario(this)">
                                                    <div class="selecionado">
                                                        <ion-icon name="person-circle"></ion-icon>
                                                        <span>Todos</span>
                                                    </div>
                                                    <div class="selecionado-icone">
                                                        <ion-icon name="checkmark-sharp"></ion-icon>
                                                    </div>
                                                </li>`;
        for(let i = 0; i < resposta.data.length; i++){
            seletorSelecaoParticipantes.innerHTML += `<li onclick="selecionarDestinatario(this)">
                                                        <div class="selecionado">
                                                            <ion-icon name="person-circle"></ion-icon>
                                                            <span>${resposta.data[i].name}</span>
                                                        </div>
                                                        <div class="selecionado-icone escondido">
                                                            <ion-icon name="checkmark-sharp"></ion-icon>
                                                        </div>
                                                    </li>`;
        }                                            
    }
}
function processarFalhaParticipantes(falha){
    if(falha.response.status === 400){
        console.log("Erro:400-Falha na busca de participantes");
    } else {
        console.log("outro-Falha na busca de participantes");
    }
}

function selecionarVisibilidade(elemento){
    const seletorAllLiVisibilidade = elemento.parentNode.querySelectorAll("li");
    const seletorElemento = elemento.querySelector("div:last-of-type");
    if(seletorElemento.classList.contains("escondido")){
        for(let i = 0; i < seletorAllLiVisibilidade.length; i++){
            (seletorAllLiVisibilidade[i].querySelector("div:last-of-type")).classList.add("escondido");
        }
    }
    seletorElemento.classList.remove("escondido");
    console.log(elemento);
    if(elemento.querySelector(".selecionado").classList.contains("reservado")){
        visibilidade = "private_message";
    }else {
        visibilidade = "message";
    }
}

function selecionarDestinatario(elemento){
    const seletorAllLiParticipantes = elemento.parentNode.querySelectorAll("li");
    const seletorElemento = elemento.querySelector("div:last-of-type");
    if(seletorElemento.classList.contains("escondido")){
        for(let i = 0; i < seletorAllLiParticipantes.length; i++){
            (seletorAllLiParticipantes[i].querySelector("div:last-of-type")).classList.add("escondido");
        }
    }
    seletorElemento.classList.toggle("escondido");
    destinatario = elemento.querySelector(".selecionado span").innerHTML;
    //ADICIONAR O NOME DO DESTINATARIO EMBAIXO DO INPUT
}
