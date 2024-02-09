const pokeContainer = document.getElementById("pokeContainer");
const input = document.getElementById("input");

class Pokemon {
    constructor(name, image, types, index) {
        this.name = name;
        this.image = image;
        this.types = types;
        this.index = index;
    }
}

const pokemons = [];
async function initializePokemon() {
    for (let i = 1; i <= 151; i++) {
        pokemons.push(await getPokemon(i));
    }
    pokeDraw(pokemons);
}

initializePokemon();

function pokeDraw(pokemons){
    const tarjeta = document.createDocumentFragment();
    for(let i = 0; i < pokemons.length; i++){
        const div = document.createElement('div');
        div.className = 'tarjeta';
        div.innerHTML = `<img id="imagen${i + 1}" height="140px" src=${pokemons[i].image} />
                         <h1 class="id">#${pokemons[i].index.toString().padStart(3, '0')}</h1>
                         <h1 class="nombre" id="name${i + 1}">${pokemons[i].name}</h1>
                         ${getColors(pokemons[i].types[0])}
                         <span class="tipo">${pokemons[i].types[0]}</span>
                         ${getColors(pokemons[i].types[1])}
                         <span class="tipo">
                             ${pokemons[i].types[1] ? pokemons[i].types[1] : ''}
                         </span>`;
        tarjeta.appendChild(div);
    }
    pokeContainer.appendChild(tarjeta);
}

input.addEventListener("keyup", filtro);

 function filtro(e){
    const inputValue = input.value;
    let filtrado = [];
    pokeContainer.innerHTML = '';
    if(inputValue.length == 0){ 
        pokeDraw(pokemons);
    }else {
        for(let i = 0; i < pokemons.length; i++){
            if((pokemons[i].name).includes(inputValue)){
                filtrado.push(pokemons[i]);
            }
        }
        pokeDraw(filtrado);
    } 
 }
 const tipoElements = document.getElementsByClassName('tipo');
 function getColors (t){
    console.log(t);
    for (let i = 0; i < tipoElements.length; i++) {
        const tipoElement = tipoElements[i];
    switch (t) {
        case "Planta":
            tipoElement.classList.add('planta');
            break;

        case "Fuego":
            tipoElement.classList.add('fuego');
            break;

        case "Agua":
            tipoElement.classList.add('agua');
            break;

        case "Electrico":
            tipoElement.classList.add('electrico');
            break;

        case "Veneno":
            tipoElement.classList.add('veneno');
            break;

        case "Volador":
            tipoElement.classList.add('volador');
            break;

        case "Bicho":
            tipoElement.classList.add('bicho');
            break;

        case "Normal":
            tipoElement.classList.add('normal');
            break;

        case "Tierra":
            tipoElement.classList.add('tierra');
            break;

        case "Hada":
            tipoElement.classList.add('hada');
            break;

        case "Lucha":
            tipoElement.classList.add('lucha');
            break;

        case "Psiquico":
            tipoElement.classList.add('psiquico');
            break;

        case "Roca":
            tipoElement.classList.add('roca');
            break;

        case "Acero":
            tipoElement.classList.add('acero');
            break;

        case "Hielo":
            tipoElement.classList.add('hielo');
            break;

        case "Fantasma":
            tipoElement.classList.add('fantasma');
            break;

        case "Dragon":
            tipoElement.classList.add('dragon');
            break;
        
    }
 }
}

async function getPokemon(id){
    const pokemonJson = await getData(`https://pokeapi.co/api/v2/pokemon/${id}`);

    const name = pokemonJson.name;
    const image = pokemonJson.sprites.front_default;
    const types = await getTypes(pokemonJson.types);
    const index = pokemonJson.game_indices[3].game_index;

    return new Pokemon(name, image, types, index);
}

async function getTypes(pokeType){
    let pokeTipo = pokeType.slice();
    const types = [];
    if(pokeTipo.length == 2){
        types.push(await getTranslatedTypeName(pokeTipo[0].type.name));

        types.push(await getTranslatedTypeName(pokeTipo[1].type.name)); 
    }else{
        types.push(await getTranslatedTypeName(pokeTipo[0].type.name));
    }

    return types;
}

async function getTranslatedTypeName(name){
    const obj = await getData(`https://pokeapi.co/api/v2/type/${name}`);
    for(let name of obj.names){
        if(name.language.name == 'es'){
            return name.name;
        }
    }
}

async function getData(url){
    const response = await fetch(url);
    const json = await response.text();
    return JSON.parse(json);
}

