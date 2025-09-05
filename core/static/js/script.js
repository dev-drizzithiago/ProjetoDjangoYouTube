import { btn_index as btn, getCookie, elemento_index, ValidandoCampos } from './utilitys.js';

class btn_youtube  {

    constructor(link, midia) {
        this.link = link;
        this.midia = midia;
    }

    async add_link() {
        try {
            const response = await fetch("/add_link_sistema/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify(this.link)
            })

            const data = await response.json();
            elemento_index.msg_alerta.innerText = data.mensagem;
            console.warn(data.mensagem);
        } catch (error) {
            console.error('Error adding link:', error);
        }
    }

    player_midia() {
        console.log(this.midia);
        const dialog = document.querySelector('.dialog_play');
        const video = dialog.querySelector('.video_player source');
        video.src = this.midia;
        dialog.showModal();
    }
}


function carregaPagina(response) {
    const elemento = document.querySelector('.div_resultado_link');  // Elemento onde os links serão carregados
    const lista = document.createElement('ul');  // Cria uma lista não ordenada, conterá os links
    elemento.appendChild(lista);  // cria a lista dentro do elemento

    response.forEach(item => {
        const li = document.createElement('li');  // cria um item de lista, onde vai conter cada dado
        li.textContent = item;  // define o texto do item de lista
        lista.appendChild(li);  // adiciona o item de lista à lista
    });
}

function request() {
    fetch("/links_salvos/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify('requesting'),
    })
    .then(response => response.json())
    .then(data => {
        carregaPagina(data.mensagem);
    })
    .catch(error => {
        console.error('Error fetching links:', error);
    });
}

/** Botão para adicionar o link no banco de dados */
btn.btn_adicionar.addEventListener('click', (event) => {
    event.preventDefault();
    const link = document.getElementById('id_input_link').value;

    const validar_link = new ValidandoCampos();
    if (!validar_link.validar_campos()) {
        return;
    }

    const btn = new btn_youtube(link);
    btn.add_link();
});

/** Botão para baixar o vídeo */
if (btn.btn_download !== null) {
    btn_index.btn_download.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Download button clicked');
    });
}


/** Botão para remover o registro na base de dados */
if (btn.btn_remover !== null) {
    btn_index.btn_remover.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Remover button clicked');
    });
}


/** Botão para reproduzir o vídeo/audio */
if (btn.btn_player !== null) {
    btn_index.btn_player.addEventListener('click', (event) => {
        event.preventDefault();
        const entrada_midia = document.getElementById('id_video_teste').getAttribute('data-url');
        console.log(entrada_midia)
        const btn = new btn_youtube();
        btn.player_midia();
    });
}

// Função para lidar com cliques em links
document.addEventListener('click', (event) => {
    const elemento = event.target
    const tag = elemento.tagName.toLowerCase();
    const id = elemento.id;    

    if (tag === 'a') {
        if (id === 'id_a_down_links') {            
            request();
        }
        else if (id === 'id_a_player_midias') {            
            request();
        }
    }
})