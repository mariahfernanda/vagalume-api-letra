const $conteudo = document.getElementById("conteudo");
const $artista = document.getElementById("artista");
const $nomeArtista = document.getElementById("nome_artista");
const $imgArtista = document.getElementById("container_img_artista");
const $tblMusicas = document.getElementById("musicas");
const $btnBuscar = document.getElementById("btn_buscar");
const $bkgDadosArtista = document.getElementById("dados_artista");
const $msgErro = document.getElementById("msg_erro");
const $letraDaMusica = document.getElementById("letra_da_musica");
const $linkVagalume = "https://www.vagalume.com.br";

let urlArtista = "";

const limparArtista = () =>{
    console.log("teste")
    $nomeArtista.innerHTML = "";
    $bkgDadosArtista.style.backgroundImage = "";
    $imgArtista.innerHTML = "";
    $tblMusicas.innerHTML = "";
    $letraDaMusica.innerHTML = "";
    return $msgErro.innerHTML = `<h4 class='txt-center'>Nenhum resultado para <span class='erro'>${$artista.value}</span></h4>`;
}

const erroArtista = (nome, elemento) =>{

    limparArtista();
}


const formatarNomeArtista = (artista) =>{

    artista = artista.toLowerCase().trim();
    artista = artista.trim();
    artista = artista.replace(/ /g, "-");
    artista = artista.replace(/ç/g, "c");
    artista = artista.replace(/é/g, "e");
    artista = artista.replace(/á/g, "a");
    artista = artista.replace(/í/g, "i");

    encontrarArtista(artista);
}

const mostrarDadosArtista = (nome, fotoMenor, fotoMaior, musicasArray) =>{

    if(nome == ""){

        limparArtista();

    }else{
        $nomeArtista.innerHTML = nome;
        $imgArtista.innerHTML = `<img class='bkg-img visivel' src='${fotoMenor}'/>`;
        $bkgDadosArtista.style.backgroundImage = `url(${fotoMaior})`;

        let contadora = 0;
        const musica = (acc, json) =>{
            contadora += 1;
            return acc + 
                            `<tr>
                                <td class='txt-center'>${contadora}</td>
                                <td class='txt-center td_musicas' id='${contadora}'>${json.desc}</td>
                            </tr>`;
        }

        let elementosTbl = `<tr id='tr_principal'>
                                <td id='td_principal' class='txt-center' width='10%'>TOP</td>
                                <td id='td_principal' class='txt-center' width='90%'>MUSICAS</td>
                            </tr>`;

        let topMusicas = musicasArray.reduce(musica , elementosTbl, musicasArray);

        $tblMusicas.innerHTML = topMusicas;
        $msgErro.innerHTML = "";

    }
}

// Dados do artista 
const dadosArtista = (json) =>{
    
    console.log(json);
    // pegar nome do artista 
    const nomeArtista = json.artist.desc;

    // pegar o link foto do artista no menor formato
    let linkFotoSmall = json.artist.pic_small;
    const fotoMenor = $linkVagalume + linkFotoSmall;

    // pegar o link foto do artista no maior formato
    let linkFotoMedium = json.artist.pic_medium;
    const fotoMaior = $linkVagalume + linkFotoMedium;

    // pegando top musicas
    let musicasArray = json.artist.toplyrics.item;
    
    mostrarDadosArtista(nomeArtista, fotoMenor, fotoMaior, musicasArray);
    
}

// buscar artista na API do vagalume
const encontrarArtista = (artista) => {
    $letraDaMusica.innerHTML = "";
    // condição para nao procurar nome vazio
    if(artista != ""){

        // colocar a url do vagalume junto com o nome do artista
        urlArtista = `${$linkVagalume}/${artista}/index.js`;
        console.log(urlArtista);
        // passo uma promise. Se nao achar o a url retorna erro para o .catch() que chama uma funcao erroArtista() que tratará o erro
        fetch(urlArtista)
            .then( res => res.json())
            .then( res => dadosArtista(res))
            .catch( () => erroArtista());

    }else{

        // mensagem de alerta para caixa vazia
        alert("Escolha um nome de um artista!");
        mostrarDadosArtista("");

    }
}

const buscarMusica = (link) =>{
    console.log(link);

    fetch(link)
        .then( res => res.json())
        .then( res => mostrarMusica(res));

    const mostrarMusica = (json) =>{
        console.log(json);

        let titleMusica = json.mus[0].name;
        let letraMusicaPromisse = json.mus[0].text;

        letraMusicaPromisse = letraMusicaPromisse.replace(/\n/g, "<br>");

        $letraDaMusica.innerHTML = letraMusicaPromisse;
        console.log($letraDaMusica);
        
    }
}

let linkMusica = "";

// Tratamento para os nomes daas musicas
const letraMusica = (musica) =>{
    console.log(musica);
    musica = musica.toLowerCase();
    musica = musica.trim();
    musica = musica.replace(/[{,}]/g, "-");
    musica = musica.replace(/[{.}]/g, "-");
    musica = musica.replace(/ /g, "-");
    musica = musica.replace(/[{(}]/g, "-");
    musica = musica.replace(/[{)}]/g, '');
    musica = musica.replace(/ó/g, "o");
    musica = musica.replace(/í/g, 'i');
    musica = musica.replace(/é/g, 'e');
    musica = musica.replace(/á/g, 'a');
    musica = musica.replace(/ç/g, 'c');
    musica = musica.replace(/ã/g, 'a');
    musica = musica.replace(/ê/g, 'e');
    musica = musica.replace(/--/g, '-');

    console.log(musica);
    linkMusica = "https://api.vagalume.com.br/search.php?art=" + $artista.value + "&mus=" + musica;
    buscarMusica(linkMusica);
}


let contadoraElementoMusica = 0;
const pegarMusica = (elemento) => {
    removerClasse("td", "bkg-red");
    

    let musica = elemento.target.innerText;
    letraMusica(musica);
    elemento.target.classList.add('bkg-red');
    $tblMusicas.classList.add('rigth');
    $tblMusicas.classList.remove('center');

}


const removerClasse = (elemento, classe) => {
    const $elemento = Array.from( document.querySelectorAll(elemento));
    $elemento.map( e  => e.classList.remove(classe));
}


const eventos = () =>{

    // pegar o nome do artista no click do botao buscar
    $btnBuscar.addEventListener('click', () => formatarNomeArtista($artista.value));

    // Pegar musica da tabela de musicas no click
    $tblMusicas.addEventListener('click', ( e ) => pegarMusica( e ));

}

eventos();