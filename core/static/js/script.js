import { btn_index, getCookie } from './utilitys.js';



function add_link_sistema (link_youtube) {
    
    
}


class btn_youtube  {

    constructor(link, midia) {
        this.link = link;
        this.midia = midia;
    }

    add_link() {
        try {
            const response = fetch("/add_link_sistema/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
            body: JSON.stringify(this.link)
            })

            const data = response.json;
            console.log(data);
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


btn_index.btn_adicionar.addEventListener('click', (event) => {
    event.preventDefault();
    const link = document.getElementById('id_input_link').value;
    const btn = new btn_youtube(link);
    btn.add_link();
});

btn_index.btn_download.addEventListener('click', (event) => {
    event.preventDefault();
    console.log('Download button clicked');
});

btn_index.btn_remover.addEventListener('click', (event) => {
    event.preventDefault();
    console.log('Remover button clicked');
});

btn_index.btn_player.addEventListener('click', (event) => {
    event.preventDefault();
    const entrada_midia = document.getElementById('id_video_teste').getAttribute('data-url');
    console.log(entrada_midia)
    const btn = new btn_youtube();
    btn.player_midia();
});