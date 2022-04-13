'use strict';

const pesquisarArtista = async ()=> {
    const artista = document.getElementById('artista').value;
    const url = `http://www.vagalume.com.br/u2/index.js`;
    const dados = await fetch(url);
    console.log(dados);
}


document.getElementById('artista');
        document.addEventListener('focusout');