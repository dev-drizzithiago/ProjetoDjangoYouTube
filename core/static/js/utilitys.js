
export const btn_index = {
    btn_adicionar: document.getElementById('id_btn_add_link'),
    btn_download: document.getElementById('id_btn_download'),
    btn_remover: document.getElementById('id_btn_remover'),
    btn_player: document.getElementById('id_btn_player'),
}

export const elemento_index = {
    msg_alerta: document.getElementById('id_msg_alerta'),
    link_entrada: document.getElementById('id_input_link'),
}

// Função para "autenticar" o django.
export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i=0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break
            }
        }
    }
    return cookieValue;
}

export class ValidandoCampos {
    constructor() {
        this.link_entrada = elemento_index.link_entrada;
    }
    
    validar_campos() {
        if (this.link_entrada.value.trim() === "") {
            elemento_index.msg_alerta.innerText = "O campo link é obrigatório.";
            return false
        } 
    }
}

export function converterDuracao(duracao) {
    const minutos = Math.round(duracao / 60); // converte o valor inteiro para minutos.
    const segundos = duracao % 60;  // converte o valor inteiro para segundos.
    return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
}



function carregaPagina(response) {
    const elemento = document.querySelector('.div_resultado_link');  // Elemento onde os links serão carregados
    const lista = document.createElement('ul');  // Cria uma lista não ordenada, conterá os links
    elemento.appendChild(lista);  // cria a lista dentro do elemento

    response.forEach(item => {
        const li = document.createElement('li');  // cria um item de lista, onde vai conter cada dado
        const img = document.createElement('img'); // cria um elemento de imagem 
        const tm = document.createElement('p')

        li.style.marginTop = '15px'; // define a margem superior da imagem

        img.style.width = '90px'; // define a largura da imagem
        img.style.height = '60px'; // define a altura da imagem
        img.style.display = 'grid'; // define o modo de exibição da imagem

        li.textContent = item.autor_link;  // define o texto do item de lista
        img.src = item.miniatura;  // define a fonte da imagem
        tm.textContent = converterDuracao(item.duracao);  // define o texto do item de lista
       
        lista.appendChild(li);  // adiciona o item de lista à lista
        li.appendChild(img); // adiciona a imagem ao item de lista
        li.appendChild(tm); // adiciona a duração ao item de lista
    });
}