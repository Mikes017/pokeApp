const imgPoke2 = document.querySelector('#poke2');
const namePoke2 = document.querySelector('#nombrePoke-rival');
const poke2Tipo = document.querySelector('#tipoRival');
const poke2Ataque = document.querySelector('#ataqueRival');
const hpRival = document.querySelector('#hpRival');

const imgPoke = document.querySelector('#poke');
const namePoke = document.querySelector('#nombrePoke-propio');
const pokeTipo = document.querySelector('#tipoPropio');
const pokeAtaque = document.querySelector('#ataquePropio');
const hpPropio = document.querySelector('#hpPropio');

const input = document.querySelector('#input');
const btonElegir = document.querySelector('#botonPoke');
const btonAtaque = document.querySelector('#combate');

let hpPropioInicial;

const getNumRandom = () => {
    let min = Math.ceil(1);
    let max = Math.floor(1001);
    return Math.floor(Math.random() * (max - min) + min);
}

const primeraMayuscula = (cadena) => {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

const asignarColorFondoTipo = (tipo) => {
    switch (tipo) {
        case 'normal':
            return '#A8A77A'; 
        case 'fire':
            return '#EE8130'; 
        case 'water':
            return '#6390F0'; 
        case 'electric':
            return '#F7D02C'; 
        case 'grass':
            return '#7AC74C'; 
        case 'ice':
            return '#96D9D6'; 
        case 'fighting':
            return '#C22E28'; 
        case 'poison':
            return '#A33EA1'; 
        case 'ground':
            return '#E2BF65'; 
        case 'flying':
            return '#A98FF3'; 
        case 'psychic':
            return '#F95587'; 
        case 'bug':
            return '#A6B91A'; 
        case 'rock':
            return '#B6A136'; 
        case 'ghost':
            return '#735797';
        case 'dragon':
            return '#6F35FC';
        case 'dark':
            return '#705746';
        case 'steel':
            return '#B7B7CE'; 
        case 'fairy':
            return '#D685AD'; 
        
        default:
            return 'black'; 
    }
}

const obtenerPokePropio = () => {
    const num = input.value;
    axios.get(`https://pokeapi.co/api/v2/pokemon/${num}`).then((res) => {
        const data = res.data;
        imgPoke.src = data.sprites.back_default;
        const tipoPropio = primeraMayuscula(data.types[0].type.name);
        pokeTipo.innerHTML = tipoPropio;
        pokeTipo.style.backgroundColor = asignarColorFondoTipo(data.types[0].type.name);
        namePoke.innerHTML = primeraMayuscula(data.name);
        pokeAtaque.innerHTML = data.stats.find(stat => stat.stat.name === 'attack').base_stat;
        const hp = data.stats.find(stat => stat.stat.name === 'hp').base_stat;
        hpPropio.innerHTML = hp;
        hpPropioInicial = hp;
    });
}

const obtenerPokeRival = () => {
    const numPokeRival = getNumRandom();
    axios.get(`https://pokeapi.co/api/v2/pokemon/${numPokeRival}`).then((res) => {
        const data = res.data;
        imgPoke2.src = data.sprites.front_default;
        const tipoRival = primeraMayuscula(data.types[0].type.name);
        poke2Tipo.innerHTML = tipoRival;
        poke2Tipo.style.backgroundColor = asignarColorFondoTipo(data.types[0].type.name);
        namePoke2.innerHTML = primeraMayuscula(data.name);
        poke2Ataque.innerHTML = data.stats.find(stat => stat.stat.name === 'attack').base_stat;
        hpRival.innerHTML = data.stats.find(stat => stat.stat.name === 'hp').base_stat;
    });
}

const resultadoCombate = document.querySelector('#resultadoCombate');

const combate = () => {
    const ataqueRival = parseInt(poke2Ataque.textContent);
    const ataquePropio = parseInt(pokeAtaque.textContent);
    const tipoRival = poke2Tipo.textContent.toLowerCase();
    const tipoPropio = pokeTipo.textContent.toLowerCase();
    const hpRivalActual = parseInt(hpRival.textContent);
    const hpPropioActual = parseInt(hpPropio.textContent);

    let nuevoHpRival = hpRivalActual;
    let nuevoHpPropio = hpPropioActual;

    let mensajeAtaque = '';
    let mensajeResultado = '';

    
    if (ventajasTipo[tipoPropio] && ventajasTipo[tipoPropio].includes(tipoRival)) {
        nuevoHpRival -= ataquePropio * 2; // Doble de daño
        mensajeAtaque = `${namePoke.textContent} ataca y hace ${ataquePropio * 2} de daño efectivo contra ${namePoke2.textContent}!\n`;
    } else {
        nuevoHpRival -= ataquePropio;
        mensajeAtaque = `${namePoke.textContent} ataca y hace ${ataquePropio} de daño contra ${namePoke2.textContent}.\n`;
    }

    
    if (nuevoHpRival <= 0) {
        mensajeResultado = `${namePoke.textContent} debilita a ${namePoke2.textContent}!\n`;
    } else {
        if (ventajasTipo[tipoRival] && ventajasTipo[tipoRival].includes(tipoPropio)) {
            nuevoHpPropio -= ataqueRival * 2; // Doble de daño
            mensajeResultado = `${namePoke2.textContent} ataca y hace ${ataqueRival * 2} de daño efectivo contra ${namePoke.textContent}!`;
        } else {
            nuevoHpPropio -= ataqueRival;
            mensajeResultado = `${namePoke2.textContent} ataca y hace ${ataqueRival} de daño contra ${namePoke.textContent}.`;
        }
    }

    hpRival.innerHTML = nuevoHpRival > 0 ? nuevoHpRival : 0;
    hpPropio.innerHTML = nuevoHpPropio > 0 ? nuevoHpPropio : 0;

    resultadoCombate.textContent = mensajeAtaque + mensajeResultado;

    if (nuevoHpRival <= 0) {
        obtenerPokeRival();
        hpPropio.innerHTML = hpPropioInicial;
    } else if (nuevoHpPropio <= 0) {
        alert(`${namePoke2.textContent} ha ganado!`);
    }
}




const nuevoRivalButton = document.querySelector('#nuevoRival');

nuevoRivalButton.addEventListener('click', () => {
    obtenerPokeRival();
    hpPropio.innerHTML = hpPropioInicial;
});


const ventajasTipo = {
    normal: ['rock', 'steel'],
    fire: ['grass', 'ice', 'bug', 'steel'],
    water: ['fire', 'ground', 'rock'],
    electric: ['water', 'flying'],
    grass: ['water', 'ground', 'rock'],
    ice: ['grass', 'ground', 'flying', 'dragon'],
    fighting: ['normal', 'ice', 'rock', 'dark', 'steel'],
    poison: ['grass', 'fairy'],
    ground: ['fire', 'electric', 'poison', 'rock', 'steel'],
    flying: ['grass', 'fighting', 'bug'],
    psychic: ['fighting', 'poison'],
    bug: ['grass', 'psychic', 'dark'],
    rock: ['fire', 'ice', 'flying', 'bug'],
    ghost: ['psychic', 'ghost'],
    dragon: ['dragon'],
    dark: ['psychic', 'ghost'],
    steel: ['ice', 'rock', 'fairy'],
    fairy: ['fighting', 'dragon', 'dark'],
    
};

const obtenerNuevoRival = () => {
    obtenerPokeRival(); 
};

nuevoRivalButton.addEventListener('click', obtenerNuevoRival);

window.addEventListener('load', obtenerPokeRival);
btonElegir.addEventListener('click', obtenerPokePropio);
btonAtaque.addEventListener('click', combate);