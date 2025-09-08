
export const btn_index = {
    btn_img_add: document.querySelector('.img_btn_add')

}

export const elemento_index = {
    msg_alerta: document.getElementById('id_msg_alerta'),
    link_entrada: document.getElementById('id_input_link'),
    div_result: document.querySelector('.content'),
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
        this.link_entrada = elemento_index.link_entrada; 
    }
    
    validar_campos() {
        if (this.link_entrada.value.trim() === "") {
            elemento_index.msg_alerta.innerText = "O campo link é obrigatório.";
            return false
        }
        setTimeout(()=>{
            elemento_index.msg_alerta.innerText = '';
        }, 10000)
        return true;
    }
}

export function converterDuracao(duracao) {
    const minutos = Math.round(duracao / 60); // converte o valor inteiro para minutos.
    const segundos = duracao % 60;  // converte o valor inteiro para segundos.
    return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
}
