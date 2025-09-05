import { btn_index as btn, getCookie, elemento_index, ValidandoCampos, converterDuracao } from './utilitys.js';

const elemento = document.querySelector('.div_resultado_link');  // Elemento onde os links serão carregados

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
    console.log(response)
    const elementoDivResult = document.querySelector('.div_resultado_link');

    const main = document.createElement('main'); // Cria o elemento main
    main.classList.add('content'); // atribui uma class ao elemento main. 

    const lista = document.createElement('ul');  // Cria uma lista não ordenada, conterá os links

    elementoDivResult.appendChild(main); // Adicionar o elemento dentro da div de resultado
    elementoDivResult.appendChild(lista); // Adicionar o elemento dentro da div de resultado

    response.forEach(element => {       

        const articulador = document.createElement('article');
        articulador.classList.add('views', 'class_views_links');

        const cabecalho = document.createElement('header');

        const pAutorLink = document.createElement('li');
        pAutorLink.id = 'id_p_autor_link';

        const pDuracao = document.createElement('p');
        pDuracao.id = 'id_p_duracao';

        const img = document.createElement('img'); // cria um elemento de imagem 
        img.id = 'img_miniatura'

        const divBtn = document.createElement('div');

        const btnDownloadLink = document.createElement('button');
        btnDownloadLink.innerText = 'Download';

        const btnRemoverLink = document.createElement('button');
        btnRemoverLink.innerText = 'Remover';

        elementoDivResult.appendChild(articulador);
        articulador.appendChild(cabecalho);
        cabecalho.appendChild(pAutorLink);
        articulador.appendChild(pDuracao);
        articulador.appendChild(divBtn);
        
        divBtn.appendChild(btnDownloadLink);
        divBtn.appendChild(btnRemoverLink);

        const p_autor_link = document.getElementById('id_p_autor_link');
        const p_duracao = document.getElementById('id_p_duracao');
        const miniatura = document.getElementById('img_miniatura');

        p_autor_link.textContent = `${element.autor_link} - ${element.titulo_link}`;
        p_duracao.textContent = converterDuracao(element.duracao);
        miniatura.src = element.miniatura;
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
        carregaPagina(data.send_json);
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