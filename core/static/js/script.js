import { btn_index, getCookie } from './utilitys.js';



function add_link_sistema (link_youtube) {
    const response = fetch("/add_link_sistema/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(link_youtube)
    })

    const data = response.json;
    console.log(data);
}


class btn_youtube  {

    constructor(link) {
        this.link = link;
    }

    add_link() {
        add_link_sistema(this.link);
    }

    player_midia(midia) {
        const dialog = document.querySelector('.dialog_play');
        const video = dialog.querySelector('.video_player source');
        video.src = midia;
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
    const midia = document.getElementById('id_video_teste').getAttribute('data-url');
    console.log(midia)
    const btn = new btn_youtube();
    btn.player_midia();
});