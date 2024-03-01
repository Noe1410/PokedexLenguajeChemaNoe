const containerInfoinfo = document.getElementById("containerInfo");
const foto = document.getElementById("foto");
const containerStats = document.getElementById("containerStats");
const containerEvolution = document.getElementById("containerEvolution");
const urlParams = new URLSearchParams(window.location.search);
const Id = urlParams.get('id');

class Pokemon {
    constructor(name, image, types, index, peso, altura, descrip, stats, chainEvolution) {
        this.name = name.charAt(0).toUpperCase() + name.slice(1);
        this.image = image;
        this.types = types;
        this.index = index;
        this. peso = peso;
        this. altura = altura;
        this. descrip = descrip;
        this.stats = stats;
        this.chainEvolution = chainEvolution;
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
    foto.innerHTML = `<img id="imagen" src="${pokemons[0].image}" width=300px>`;
    const info = document.createElement('div');
    info.className = 'info';
    info.innerHTML = `<ul id="lista1">
                            <li><h2>${pokemons[0].name}</h2></li>
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
    const statTable = document.createElement('table');
    statTable.className = 'stats';
    statTable.innerHTML = `<tr>
                                <th>Atributo</th>
                                <th>Valor</th>
                            </tr>
                            <tr>
                                <td><font color="#53D906">Vida</font></td>
                                <td><progress value="${pokemons[0].stats[0].base_stat}" max="255"/></td>
                            </tr>
                            <tr>
                                <td><font color="#E71C1C">Ataque</font></td>
                                <td><progress value="${pokemons[0].stats[1].base_stat}" max="255"/></td>
                            </tr>
                            <tr>
                                <td><font color="#ACACAC">Defensa</font></td>
                                <td><progress value="${pokemons[0].stats[2].base_stat}" max="255"/></td>
                            </tr>
                            <tr>
                                <td><font color="#0008FE">Ataque Especial</font></td>
                                <td><progress value="${pokemons[0].stats[3].base_stat}" max="255"/></td>
                            </tr>
                            <tr>
                                <td><font color="#C501E0">Defensa Especial</font></td>
                                <td><progress value="${pokemons[0].stats[4].base_stat}" max="255"/></td>
                            </tr>
                            <tr>
                                <td><font color="#2197FF">Velocidad</font></td>
                                <td><progress value="${pokemons[0].stats[5].base_stat}" max="255"/></td>
                            </tr>`;
    containerStats.appendChild(statTable);
}

function drawChainEvolution(pokemons){
    const evo = document.createElement('div'); 
}

async function getPokemon(id){
    const pokemonJson = await getData(`https://pokeapi.co/api/v2/pokemon/${id}`);

    const name = pokemonJson.name;
    const image = pokemonJson.sprites.other.showdown.front_default;
    const types = await getTypes(pokemonJson.types);
    const index = pokemonJson.game_indices[3].game_index;
    const peso = pokemonJson.weight;
    const altura = pokemonJson.height;
    const descrip = await getDescription(id);
    const chainEvolution = await getChainEvolution(id);
    const stats = pokemonJson.stats;
    return new Pokemon(name, image, types, index, peso, altura, descrip, stats, chainEvolution);
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

async function getDescription(id) {
        const speciesData = await getData(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
        const description = getTranslatedDescription(id);
        return description;
}

async function getTranslatedDescription(id){
    const obj = await getData(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
    for(let descrip of obj.flavor_text_entries){
        if(descrip.language.name == 'es'){
            return descrip.flavor_text;
        }
    }
}


async function getSpecies(id){
    const speciesData = await getData(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
    return speciesData;
}

async function getChainEvolution(id) {
    const speciesData = await getSpecies(id);
    const chainUrl = speciesData.evolution_chain.url;
    const chainData = await getData(chainUrl);
    
    const arrayEvolution = [];
    
    function verChain(chain) {
        const name = chain.species.name;
        const id = getId(chain.species.url);

        if (id <= 151) {
            arrayEvolution.push(name);
            
            if (chain.evolves_to && chain.evolves_to.length > 0) {
                chain.evolves_to.forEach(evolution => {
                    verChain(evolution);
                });
            }
        }
    }

    verChain(chainData.chain);
    console.log("Cadena evolutiva del Pokémon:");
    console.log(arrayEvolution);
    return arrayEvolution;
}

function getId(url) {
    const partes = url.split('/');
    return parseInt(partes[partes.length - 2]);
}


async function getData(url){
    const response = await fetch(url);
    const json = await response.text();
    return JSON.parse(json);
}