import { btn_index as btn, getCookie, elemento_index, btn_index, ValidandoCampos, converterDuracao } from './utilitys.js';

class objYoutube  {

    constructor(link) {
        this.link = link;
    }

    async add_link() {
        try {
            const response = await fetch("/add_link_sistema/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                credentials: 'include',
                body: JSON.stringify(this.link),
            })
            const data = await response.json();
            elemento_index.msg_alerta.innerText = data.mensagem;
            console.warn(data.mensagem);
        } catch (error) {
            console.error('Error adding link:', error);
        } finally {
            elemento_index.link_entrada.value = '';
            setTimeout(()=>{
                elemento_index.msg_alerta.innerText = '';
            }, 10000)
        }
    }

    player_midia() {
        const btnFechar = document.querySelector('.btn_fechar_dialog');
        const dialog = document.querySelector('.dialog_play');
        const video = dialog.querySelector('.video_player source');
        const videoTag = dialog.querySelector('.video_player');

        video.src = encodeURI(this.link);
        console.log(video.src)
        videoTag.load();
        dialog.showModal();

        // Evento para fechar o diálogo
        
        btnFechar.addEventListener('click', () => {
            videoTag.pause();
            dialog.close();
        });
    }

    async downloadlinkYoutube() {
        console.log('link', this.link);
        const modal = elemento_index.modalOpcMidia;
        modal.showModal();

        const btnContinuar = document.querySelector('.btnOpcMidia')
            btnContinuar.addEventListener('click', () => {
            modal.close()
            const opcaoMidia = document.querySelector('input[name="nOpcao"]:checked')
            console.log(opcaoMidia.value)
        })
            
        const data_to_django = {
            link: this.link,
            midia: 'opcaoMidia',
        }

        try {
            const response = await fetch("/download_link/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: 'include',
            body: JSON.stringify(data_to_django),
        });

        const data = await response.json();
        console.log(data)
        elemento_index.msg_alerta.innerText = data.mensagem;

        } catch (error) {
            console.error('Error downloading link:', error);
        } finally {
            elemento_index.link_entrada.value = '';
            setTimeout(()=>{
                elemento_index.msg_alerta.innerText = '';
            }, 10000)
        }
    }
}

function carregaPagina(response, img_btn) {
    if (elemento_index.div_result.innerHTML !== '') {
        elemento_index.div_result.innerHTML = '';
    }
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
        btnDownloadLink.classList.add('btnDownloadYoutube');
        btnDownloadLink.style.width = '60px';
        btnDownloadLink.style.height = '60px';
        btnDownloadLink.style.backgroundColor = '#c5c5c5ff';

        const btnRemoverLink = document.createElement('button');
        btnRemoverLink.classList.add('btnRemoveYoutube');
        btnRemoverLink.style.width = '60px';
        btnRemoverLink.style.height = '60px';
        btnRemoverLink.style.backgroundColor = '#c5c5c5ff';

        const btnAcessarLink = document.createElement('button');
        btnAcessarLink.classList.add('btnAcessarYoutube');
        btnAcessarLink.style.width = '60px';
        btnAcessarLink.style.height = '60px';
        btnAcessarLink.style.backgroundColor = '#c5c5c5ff';

        const img_btn_down = document.createElement('img');
        img_btn_down.classList.add('img_btn_down');
        img_btn_down.src = img_btn.download;
        img_btn_down.style.width = '50px';
        img_btn_down.style.height = '50px';
        img_btn_down.style.marginLeft = '-27px'; 
        img_btn_down.style.marginTop = '-10px';

        const img_btn_remove = document.createElement('img');
        img_btn_remove.classList.add('img_btn_remove');
        img_btn_remove.src = img_btn.remover;
        img_btn_remove.style.width = '50px';
        img_btn_remove.style.height = '50px';
        img_btn_remove.style.marginLeft = '-27px'; 
        img_btn_remove.style.marginTop = '-10px';

        const img_btn_acessar = document.createElement('img');
        img_btn_acessar.classList.add('img_btn_acessar');
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
        btnDownloadLink.setAttribute('data-url', element.link_tube);
    });
}

function PlayerMidias(response, imgBtn) {
    if (elemento_index.div_result.innerHTML !== '') {
        elemento_index.div_result.innerHTML = '';
    }
    response.forEach(element => {

        // busca o elemento <div> onde ficará todos os elementos que serão criados. 
        const elementoDivResult = document.querySelector('.content');

        // Cria uma tag <article>
        const articulador = document.createElement('article');
        articulador.classList.add('views', 'class_articulador');

        // Cria uma tag <header>
        const cabecalho = document.createElement('header');
        cabecalho.classList.add('class_cabecalho');

        // Cria uma tag <ul> para receber uma lista de informações
        const lista = document.createElement('ul');

        // Recebe o nome da mídia, onde ficará exposta para o usuário
        const midia = document.createElement('li');
        midia.classList.add('class_midia');
        midia.textContent = element.nome_midia;

        // btn para abrir a midia em uma tag de videos
        const divBtn = document.createElement('div');        
        const btnPlayerMidia = document.createElement('button');
        btnPlayerMidia.style.width = '60px';
        btnPlayerMidia.style.height = '60px';
        btnPlayerMidia.style.backgroundColor = '#c5c5c5ff';
        btnPlayerMidia.setAttribute('data-url', element.local_midia);

        // imagem para abrir a midia em uma tag de videos
        const img_btn_player = document.createElement('img');
        img_btn_player.className = 'class_img_btn_player';
        img_btn_player.src = imgBtn.botao_play;
        img_btn_player.style.width = '50px';
        img_btn_player.style.height = '50px';
        img_btn_player.style.marginLeft = '-27px'; 
        img_btn_player.style.marginTop = '-10px';

        elementoDivResult.appendChild(articulador);
        articulador.appendChild(cabecalho);

        articulador.appendChild(divBtn);
        divBtn.appendChild(btnPlayerMidia);
        btnPlayerMidia.appendChild(img_btn_player);

        articulador.appendChild(lista);
        lista.appendChild(midia);
    })    
}

async function requestPlayer() {   
    try {
        const response = await fetch("/player_midias/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: 'include',
            body: JSON.stringify({action: 'requesting'}),
        });

        if (response.ok) {
            const data = await response.json();
            PlayerMidias(data.data_midia, data.lista_img);
        } else {
            console.error('Error fetching player media:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching player media:', error);
    } 
}

function requestLinksSalvos() {

    fetch("/links_salvos/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        credentials: 'include',
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

// Função para lidar com cliques em links
document.addEventListener('click', (event) => {
    const elemento = event.target
    const tag = elemento.tagName.toLowerCase();
    const id = elemento.id;
    const className = elemento.className;

    console.log(`Tag: ${tag}, ID: ${id}, Class: ${className}`);
    
    if (tag === "img") {
        event.preventDefault();

        if (className === 'img_btn_add') {
            console.log(className === 'img_btn_add')
            const link = document.getElementById('id_input_link').value;
            
            /** Valida se o campo input de link esta vazio */
            const validar_link = new ValidandoCampos();
            if (!validar_link.validar_campos()) {
                return;
            }

            const btn = new objYoutube(link);
            btn.add_link();
        }

        else if (className === 'class_img_btn_player') {
            console.log('Player midia');

            const btn = elemento.closest('button');
            const url = btn?.getAttribute('data-url');

            if (url) {
                const objPlayerMidia = new objYoutube(url);
                objPlayerMidia.player_midia();
            } else {
                console.warn('URL não encontrada no botão');
            }
        }
        else if (className === 'btnLinksYoutube') {
            requestLinksSalvos();
        }
        else if (className === 'btnMidiasYoutube') {
            requestPlayer();
        }
        else if (className === 'img_btn_down') {
            const btn = elemento.closest('button');
            const linkYoutube = btn?.getAttribute('data-url');
            
            if (linkYoutube) {
                const objDownLink = new objYoutube(linkYoutube);
                objDownLink.downloadlinkYoutube();            
            } else {
                console.warn('URL não encontrada no botão');
            }
        }
    }    
})

/** Adicionar o evento de quando o mouse entra no elemento. colocar uma msg no campo de alerta */
btn_index.btn_img_add.addEventListener('mouseenter', (event) => {
    elemento_index.msg_alerta.innerText = 'Adicionar Link'
})

btn_index.btn_img_add.addEventListener('mouseout', (event) => {
    elemento_index.msg_alerta.innerText = ''
})

/** Adicionar o evento de quando o mouse entra no elemento. colocar uma msg no campo de alerta */
btn_index.btn_img_view.addEventListener('mouseenter', (event) => {
    elemento_index.msg_alerta.innerText = 'Links Salvos'
})

btn_index.btn_img_view.addEventListener('mouseout', (event) => {
    elemento_index.msg_alerta.innerText = ''
})

/** Adicionar o evento de quando o mouse entra no elemento. colocar uma msg no campo de alerta */
btn_index.btn_img_midias.addEventListener('mouseenter', (event) => {
    elemento_index.msg_alerta.innerText = 'Midias Salvas'
})

btn_index.btn_img_midias.addEventListener('mouseout', (event) => {
    elemento_index.msg_alerta.innerText = ''
})