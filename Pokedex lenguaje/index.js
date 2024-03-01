const pokeContainer = document.getElementById("pokeContainer");
const input = document.getElementById("input");
const enlace = document.getElementsByClassName('tarjeta');

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
        const a = document.createElement('a');
        a.className = 'tarjeta';
        a.dataset.id = pokemons[i].index;
        a.innerHTML = `<div>
                        <img id="imagen${i + 1}" height="140px" src=${pokemons[i].image} />
                         <h1 class="id">#${pokemons[i].index.toString().padStart(3, '0')}</h1>
                         <h1 class="nombre" id="name${i + 1}">${pokemons[i].name}</h1>
                         <span class="${getColors(pokemons[i].types[0])}">${pokemons[i].types[0]}</span>
                         <span class="${getColors(pokemons[i].types[1])}">
                             ${pokemons[i].types[1] ? pokemons[i].types[1] : ''}
                         </span>
                        </div>`;
        tarjeta.appendChild(a);
    }
    pokeContainer.appendChild(tarjeta);

    const tarjetas = document.querySelectorAll('.tarjeta');
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', enlaceInfo);
    });
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

 for (let i = 0; i < enlace.length; i++) {
    enlace[i].addEventListener("click", enlaceInfo);
}

function enlaceInfo(e){
    const pokemonId = this.dataset.id;
    const url = `pokeinfo.html?id=${pokemonId}`;
    window.location.href = url;
}


 function getColors (t){
    for(let i = 0; i < 17; i++){
        switch (t) {
            case "Planta":
                return 'planta';
                break;
    
            case "Fuego":
                return 'fuego';
                break;
    
            case "Agua":
                return 'agua';
                break;
    
            case "Eléctrico":
                return 'electrico';
                break;
    
            case "Veneno":
                return 'veneno';
                break;
    
            case "Volador":
                return 'volador';
                break;
    
            case "Bicho":
                return 'bicho';
                break;
    
            case "Normal":
                return 'normal';
                break;
    
            case "Tierra":
                return 'tierra';
                break;
    
            case "Hada":
                return 'hada';
                break;
    
            case "Lucha":
                return 'lucha';
                break;
    
            case "Psíquico":
                return 'psiquico';
                break;
    
            case "Roca":
                return 'roca';
                break;
    
            case "Acero":
                return 'acero';
                break;
    
            case "Hielo":
                return 'hielo';
                break;
    
            case "Fantasma":
                return 'fantasma';
                break;
    
            case "Dragón":
                return 'dragon';
                break;
    
            default:
                return 'sintipo';
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
/////

var toggle = document.getElementById('container');
var poke = document.getElementById('pokeContainer');
var elemento = document.getElementsByClassName("tarjeta"); 

toggle.onclick = function(){
    toggle.classList.toggle('active');
    poke.classList.toggle('active');
    Array.from(elemento).forEach(elemento => {
        elemento.classList.toggle('active');
    });
}

