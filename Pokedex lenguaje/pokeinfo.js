const containerInfoinfo = document.getElementById("containerInfo");
const foto = document.getElementById("foto");
const containerStats = document.getElementById("containerStats");
const urlParams = new URLSearchParams(window.location.search);
const Id = urlParams.get('id');

class Pokemon {
    constructor(name, image, types, index, peso, altura, descrip, stats) {
        this.name = name.charAt(0).toUpperCase() + name.slice(1);
        this.image = image;
        this.types = types;
        this.index = index;
        this. peso = peso;
        this. altura = altura;
        this. descrip = descrip;
        this.stats = stats;
    }
}
const pokemons = [];
async function initializePokemon() {
        pokemons.push(await getPokemon(Id));
        drawInfo(pokemons);
        drawStats(pokemons);
}

initializePokemon();

function drawInfo(pokemons) {
    foto.innerHTML = `<img id="imagen" src="${pokemons[0].image}" width=500px>`;
    const info = document.createElement('div');
    info.className = 'info';
    info.innerHTML = `<ul id="lista1">
                            <li>Nombre: ${pokemons[0].name}</li>
                            <li>Número Pokédex: ${pokemons[0].index}</li>
                            <li>Tipo: ${pokemons[0].types.join(', ')}</li>
                        </ul>
                        <ul>
                            <li>Peso: ${pokemons[0].peso}</li>
                            <li>Altura: ${pokemons[0].altura}</li>
                            <li>Descripción: ${pokemons[0].descrip}</li>
                        </ul>`;
    containerInfo.appendChild(info);
}

function drawStats(pokemons){
    const stat = document.createElement('div');
    stat.className = 'stats';
    stat.innerHTML = `<div id="grafica">
                            <div id="vida"> vida</div>  
                            <div id="ataque"> ataque</div>  
                            <div id="Defensa"> defensa</div>  
                            <div id="Atesp"> at.esp</div>  
                            <div id="Defesp"> def.esp</div>  
                            <div id="Velocidad"> velocidad</div>                                            
                        </div>
                        <div id="grafica">
                            <div >
                            <progress value="${pokemons[0].stats[0].base_stat}" max="255"/>
                            </div>  
                            <div >
                            <progress value="${pokemons[0].stats[0].base_stat}" max="255"/></div>  
                            <div >
                            <progress value="${pokemons[0].stats[0].base_stat}" max="255"/></div>  
                            <div >
                            <progress value="${pokemons[0].stats[0].base_stat}" max="255"/></div>  
                            <div >
                            <progress value="${pokemons[0].stats[0].base_stat}" max="255"/></div>  
                            <div id="statVelocidad"></div>                                            
                        </div>`;
    containerStats.appendChild(stat);
}

async function getPokemon(id){
    const pokemonJson = await getData(`https://pokeapi.co/api/v2/pokemon/${id}`);

    const name = pokemonJson.name;
    const image = pokemonJson.sprites.front_default;
    const types = await getTypes(pokemonJson.types);
    const index = pokemonJson.game_indices[3].game_index;
    const peso = pokemonJson.weight;
    const altura = pokemonJson.height;
    const descrip = await getDescription(id);
    const stats = pokemonJson.stats;
    return new Pokemon(name, image, types, index, peso, altura, descrip, stats);
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

async function getDescription(id) {
        const speciesData = await getData(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
        const description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'es');
        const lines = description.flavor_text.split('\n');
        const d= lines.join('\n');
        return d;
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