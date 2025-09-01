
export const btn_index = {
    btn_adicionar: document.getElementById('id_btn_add_link'),
    btn_download: document.getElementById('id_btn_download'),
    btn_remover: document.getElementById('id_btn_remover'),
    btn_player: document.getElementById('id_btn_player'),
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