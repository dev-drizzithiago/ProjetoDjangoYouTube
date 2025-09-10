
export const btn_index = {
    btn_img_add: document.querySelector('.img_btn_add'),
    btn_img_view: document.querySelector('.btnLinksYoutube'),
    btnMidiasYoutubeMp4: document.querySelector('.btnMidiasYoutubeMp4'),
    btnMidiasYoutubeMp3: document.querySelector('.btnMidiasYoutubeMp3'),

    divBtnLinksYoutube: document.querySelector('.divBtnLinks'),
    divBtnMidiasMp4: document.querySelector('.divBtnMp4'),
    divBtnMidiasMp3: document.querySelector('.divBtnMp3'),

}

export const elemento_index = {
    div_msg_alerta: document.getElementById('id_div_msg_alerta'),
    msg_alerta: document.getElementById('id_msg_alerta'),
    link_entrada: document.getElementById('id_input_link'),
    div_result: document.querySelector('.content'),
    modalOpcMidia: document.querySelector('.modalOpcMidia'),
    divSpinner: document.querySelector('.divSpinner'),
    imgSpiiner: document.querySelector('.imgSpinner')
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
    constructor(link_entrada) {
        this.link_entrada = link_entrada;
    }
    
    
    validar_campos() {        
        if (this.link_entrada === "") {
            elemento_index.msg_alerta.innerText = "O campo link é obrigatório.";
            return false
        }
        setTimeout(()=>{
            elemento_index.msg_alerta.innerText = '';
            elemento_index.div_msg_alerta.style.background = '#dfdddddc'
        }, 10000)
        return true;
    }
}

export function converterDuracao(duracao) {
    const minutos = Math.round(duracao / 60); // converte o valor inteiro para minutos.
    const segundos = duracao % 60;  // converte o valor inteiro para segundos.
    return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
}
