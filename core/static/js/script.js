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

    const data = response.json();
    console.log(data);
}


class btn_youtube  {
    constructor(link) {
        this.link = link;
    }

    add_link() {
        add_link_sistema(this.link);
    }
}


btn_index.btn_adicionar.addEventListener('click', () => {
    const link = document.getElementById('id_input_link').value;
    const btn = new btn_youtube(link);
    btn.add_link();
});

btn_index.btn_download.addEventListener('click', () => {
    console.log('Download button clicked');
});

btn_index.btn_remover.addEventListener('click', () => {
    console.log('Remover button clicked');
});

btn_index.btn_player.addEventListener('click', () => {
    console.log('Player button clicked');
});