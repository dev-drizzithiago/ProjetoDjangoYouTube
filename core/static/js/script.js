import { btn_index as btn, getCookie, elemento_index, ValidandoCampos, converterDuracao } from './utilitys.js';

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
        video.src = encodeURI('/media/movies/Dreams (2004 Remaster).mp4');
        dialog.showModal();
    }
}

function carregaPagina(response, img_btn) {

    response.forEach(element => {
        const elementoDivResult = document.querySelector('.content'); 
        const lista = document.createElement('ul');

        const articulador = document.createElement('article');
        articulador.classList.add('views', 'class_views_links');

        const cabecalho = document.createElement('header');
        cabecalho.classList.add('id_cabecalho');

        const pAutorLink = document.createElement('li');
        pAutorLink.classList.add('id_p_autor_link');

        const pDuracao = document.createElement('p');
        pDuracao.classList.add('id_p_duracao');

        const img_miniatura = document.createElement('img'); // cria um elemento de imagem 
        img_miniatura.classList.add('img_miniatura');

        const divBtn = document.createElement('div');

        const btnDownloadLink = document.createElement('button');
        btnDownloadLink.style.width = '60px';
        btnDownloadLink.style.height = '60px';
        btnDownloadLink.style.backgroundColor = '#c5c5c5ff';

        const btnRemoverLink = document.createElement('button');
        btnRemoverLink.style.width = '60px';
        btnRemoverLink.style.height = '60px';
        btnRemoverLink.style.backgroundColor = '#c5c5c5ff';

        const btnAcessarLink = document.createElement('button');
        btnAcessarLink.style.width = '60px';
        btnAcessarLink.style.height = '60px';
        btnAcessarLink.style.backgroundColor = '#c5c5c5ff';

        const img_btn_down = document.createElement('img');
        img_btn_down.src = img_btn.download;
        img_btn_down.style.width = '50px';
        img_btn_down.style.height = '50px';
        img_btn_down.style.marginLeft = '-27px'; 
        img_btn_down.style.marginTop = '-10px';

        const img_btn_remove = document.createElement('img');
        img_btn_remove.src = img_btn.remover;
        img_btn_remove.style.width = '50px';
        img_btn_remove.style.height = '50px';
        img_btn_remove.style.marginLeft = '-27px'; 
        img_btn_remove.style.marginTop = '-10px';

        const img_btn_acessar = document.createElement('img');
        img_btn_acessar.src = img_btn.youtube;
        img_btn_acessar.style.width = '50px';
        img_btn_acessar.style.height = '50px';
        img_btn_acessar.style.marginLeft = '-27px'; 
        img_btn_acessar.style.marginTop = '-10px';

        elementoDivResult.appendChild(articulador);
        articulador.appendChild(cabecalho);
        articulador.appendChild(divBtn);
        
        cabecalho.appendChild(img_miniatura);
        cabecalho.appendChild(lista);

        lista.appendChild(pAutorLink);
        lista.appendChild(pDuracao);        

        divBtn.appendChild(btnDownloadLink);
        divBtn.appendChild(btnRemoverLink);
        divBtn.appendChild(btnAcessarLink);

        btnDownloadLink.appendChild(img_btn_down);
        btnRemoverLink.appendChild(img_btn_remove);
        btnAcessarLink.appendChild(img_btn_acessar);

        img_miniatura.src = element.miniatura;
        pAutorLink.textContent = `${element.autor_link} - ${element.titulo_link}`;
        pDuracao.textContent = `Duração: ${converterDuracao(element.duracao)}`;
    });   
}

function PlayerMidias(response, imgBtn) {
    
}

async function requestPlayer() {
    
    try {
        const response = await fetch("/player_midias/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify('requesting'),
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data.data_midia);
        //PlayerMidias(data, img_btn);
    } else {
        console.error('Error fetching player media:', response.statusText);
    }
    } catch (error) {
        console.error('Error fetching player media:', error);
    }
    
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
        carregaPagina(data.send_json, data.local_imgs);
    })
    .catch(error => {
        console.error('Error fetching links:', error);
    });
}

/** Botão para adicionar o link no banco de dados */
btn.btn_adicionar.addEventListener('click', (event) => {
    event.preventDefault();
    
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
    const className = elemento.className;

    if (tag === 'a') {
        if (id === 'id_a_down_links') {            
            request();
        }
        else if (id === 'id_a_player_midias') {  
            requestPlayer()
        }
    }

    else if (tag === "img") {
        if (className === 'img_btn_add') {
            console.log(className === 'img_btn_add')
            const link = document.getElementById('id_input_link').value;
            
            /** Valida se o campo input de link esta vazio */
            const validar_link = new ValidandoCampos();
            if (!validar_link.validar_campos()) {
                return;
            }

            const btn = new btn_youtube(link);
            btn.add_link();
        }
    }
})