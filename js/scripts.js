
const seletorChat = document.querySelector(".chat ul");

buscarMensagens();

function buscarMensagens(){
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages");

    promessa.then(processarResposta);
    promessa.catch(processarFalha);

}

function processarResposta(resposta){
    exibirMensagens(resposta.data);
}
function processarFalha(falha){
    alert(falha);
}

function exibirMensagens(listaDeMensagens){
    seletorChat.innerHTML = "";
    for(let i = 0; i < listaDeMensagens.length; i++){
    console.log(listaDeMensagens[i].type);
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
        }
    }
}