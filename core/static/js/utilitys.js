
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
            elemento_index.msg_alerta.innerText = "Por favor, insira um link válido.";
            return false
        } else {
            elemento_index.msg_alerta.remove();
            return true
        }
    }
}