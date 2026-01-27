// Pokemon 数据库 - 30个热门 Pokemon
export interface Pokemon {
    id: string;
    name: string;
    number: number;
    types: string[];
    description: string;  // 用于 prompt 生成
    emoji: string;
    imageUrl?: string;  // Pokemon 图片URL（可选，可自动生成）
    generation: number;
}

// Helper: 获取Pokemon图片URL
export function getPokemonImageUrl(pokemon: Pokemon): string {
    return pokemon.imageUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.number}.png`;
}

export const POKEMON_DATABASE: Pokemon[] = [
    // 第一世代 - 最经典
    {
        id: 'pikachu',
        name: 'Pikachu',
        number: 25,
        types: ['Electric'],
        description: 'electric mouse Pokemon with yellow fur, red cheeks, and lightning bolt tail',
        emoji: '⚡',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        generation: 1,
    },
    {
        id: 'charizard',
        name: 'Charizard',
        number: 6,
        types: ['Fire', 'Flying'],
        description: 'fire-breathing dragon Pokemon with orange scales, large wings, and flaming tail',
        emoji: '🔥',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
        generation: 1,
    },
    {
        id: 'blastoise',
        name: 'Blastoise',
        number: 9,
        types: ['Water'],
        description: 'water Pokemon with blue shell, powerful water cannons on shoulders',
        emoji: '💧',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png',
        generation: 1,
    },
    {
        id: 'mewtwo',
        name: 'Mewtwo',
        number: 150,
        types: ['Psychic'],
        description: 'legendary psychic Pokemon with purple skin, powerful telekinetic abilities',
        emoji: '🧬',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
        generation: 1,
    },
    {
        id: 'gengar',
        name: 'Gengar',
        number: 94,
        types: ['Ghost', 'Poison'],
        description: 'ghost Pokemon with purple body, mischievous grin, and shadowy appearance',
        emoji: '👻',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png',
        generation: 1,
    },
    {
        id: 'dragonite',
        name: 'Dragonite',
        number: 149,
        types: ['Dragon', 'Flying'],
        description: 'dragon Pokemon with orange body, small wings, gentle but powerful',
        emoji: '🐲',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png',
        generation: 1,
    },
    {
        id: 'eevee',
        name: 'Eevee',
        number: 133,
        types: ['Normal'],
        description: 'evolution Pokemon with brown fur, fluffy tail, and adaptable nature',
        emoji: '🦊',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
        generation: 1,
    },
    {
        id: 'snorlax',
        name: 'Snorlax',
        number: 143,
        types: ['Normal'],
        description: 'sleeping Pokemon with large blue-green body, always relaxed and hungry',
        emoji: '😴',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png',
        generation: 1,
    },
    {
        id: 'gyarados',
        name: 'Gyarados',
        number: 130,
        types: ['Water', 'Flying'],
        description: 'sea serpent Pokemon with blue scales, fierce temperament, and powerful jaws',
        emoji: '🌊',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png',
        generation: 1,
    },
    {
        id: 'alakazam',
        name: 'Alakazam',
        number: 65,
        types: ['Psychic'],
        description: 'psychic Pokemon with gold armor, spoons, and extreme intelligence',
        emoji: '🔮',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png',
        generation: 1,
    },

    // 第二世代
    {
        id: 'lugia',
        name: 'Lugia',
        number: 249,
        types: ['Psychic', 'Flying'],
        description: 'legendary guardian Pokemon with silver-white body and control over storms',
        emoji: '🕊️',
        generation: 2,
    },
    {
        id: 'ho-oh',
        name: 'Ho-Oh',
        number: 250,
        types: ['Fire', 'Flying'],
        description: 'legendary rainbow Pokemon with colorful plumage and sacred flames',
        emoji: '🌈',
        generation: 2,
    },
    {
        id: 'umbreon',
        name: 'Umbreon',
        number: 197,
        types: ['Dark'],
        description: 'dark Pokemon with black fur, yellow ring patterns that glow at night',
        emoji: '🌙',
        generation: 2,
    },
    {
        id: 'tyranitar',
        name: 'Tyranitar',
        number: 248,
        types: ['Rock', 'Dark'],
        description: 'armor Pokemon with green armored body, incredibly powerful and destructive',
        emoji: '🦖',
        generation: 2,
    },

    // 第三世代
    {
        id: 'rayquaza',
        name: 'Rayquaza',
        number: 384,
        types: ['Dragon', 'Flying'],
        description: 'sky high Pokemon with green serpentine body, controls weather from atmosphere',
        emoji: '☁️',
        generation: 3,
    },
    {
        id: 'blaziken',
        name: 'Blaziken',
        number: 257,
        types: ['Fire', 'Fighting'],
        description: 'blaze Pokemon with red feathers, powerful kicking moves and flames',
        emoji: '🥊',
        generation: 3,
    },
    {
        id: 'gardevoir',
        name: 'Gardevoir',
        number: 282,
        types: ['Psychic', 'Fairy'],
        description: 'embrace Pokemon with elegant white dress-like body, powerful psychic abilities',
        emoji: '💫',
        generation: 3,
    },
    {
        id: 'aggron',
        name: 'Aggron',
        number: 306,
        types: ['Steel', 'Rock'],
        description: 'iron armor Pokemon with metallic gray body, territorial and protective',
        emoji: '⚙️',
        generation: 3,
    },

    // 第四世代
    {
        id: 'lucario',
        name: 'Lucario',
        number: 448,
        types: ['Fighting', 'Steel'],
        description: 'aura Pokemon with blue and black fur, senses and controls aura energy',
        emoji: '🥋',
        generation: 4,
    },
    {
        id: 'garchomp',
        name: 'Garchomp',
        number: 445,
        types: ['Dragon', 'Ground'],
        description: 'mach Pokemon with blue shark-like body, incredible speed and power',
        emoji: '🦈',
        generation: 4,
    },
    {
        id: 'dialga',
        name: 'Dialga',
        number: 483,
        types: ['Steel', 'Dragon'],
        description: 'temporal Pokemon with metallic blue body, controls time itself',
        emoji: '⏰',
        generation: 4,
    },

    // 第五至八世代精选
    {
        id: 'zoroark',
        name: 'Zoroark',
        number: 571,
        types: ['Dark'],
        description: 'illusion Pokemon with red and black fur, creates powerful illusions',
        emoji: '🎭',
        generation: 5,
    },
    {
        id: 'greninja',
        name: 'Greninja',
        number: 658,
        types: ['Water', 'Dark'],
        description: 'ninja Pokemon with blue body, water shuriken, and incredible stealth',
        emoji: '🥷',
        generation: 6,
    },
    {
        id: 'sylveon',
        name: 'Sylveon',
        number: 700,
        types: ['Fairy'],
        description: 'intertwining Pokemon with pink ribbons, calms emotions with fairy energy',
        emoji: '🎀',
        generation: 6,
    },
    {
        id: 'decidueye',
        name: 'Decidueye',
        number: 724,
        types: ['Grass', 'Ghost'],
        description: 'arrow quill Pokemon with green feathers, precise archer with spirit arrows',
        emoji: '🏹',
        generation: 7,
    },
    {
        id: 'incineroar',
        name: 'Incineroar',
        number: 727,
        types: ['Fire', 'Dark'],
        description: 'heel Pokemon with flame belt, powerful wrestler with fiery passion',
        emoji: '🤼',
        generation: 7,
    },
    {
        id: 'corviknight',
        name: 'Corviknight',
        number: 823,
        types: ['Flying', 'Steel'],
        description: 'raven Pokemon with jet black metallic armor, fierce aerial warrior',
        emoji: '🦅',
        generation: 8,
    },
    {
        id: 'dragapult',
        name: 'Dragapult',
        number: 887,
        types: ['Dragon', 'Ghost'],
        description: 'stealth bomber Pokemon, launches Dreepy like missiles at incredible speed',
        emoji: '✈️',
        generation: 8,
    },
    {
        id: 'toxtricity',
        name: 'Toxtricity',
        number: 849,
        types: ['Electric', 'Poison'],
        description: 'punk Pokemon with electric guitar powers, creates toxic electric melodies',
        emoji: '🎸',
        generation: 8,
    },
    {
        id: 'cinderace',
        name: 'Cinderace',
        number: 815,
        types: ['Fire'],
        description: 'striker Pokemon with soccer player appearance, kicks flaming pyro balls',
        emoji: '⚽',
        generation: 8,
    },
    // 新增扩展
    {
        id: 'jigglypuff',
        name: 'Jigglypuff',
        number: 39,
        types: ['Normal', 'Fairy'],
        description: 'balloon Pokemon with round pink body, sings lullabies to put foes to sleep',
        emoji: '🎤',
        generation: 1,
    },
    {
        id: 'machamp',
        name: 'Machamp',
        number: 68,
        types: ['Fighting'],
        description: 'superpower Pokemon with four muscular arms, incredible strength and mastery of martial arts',
        emoji: '💪',
        generation: 1,
    },
    {
        id: 'arcanine',
        name: 'Arcanine',
        number: 59,
        types: ['Fire'],
        description: 'legendary Pokemon resembling a large dog with orange fur and black stripes, known for speed',
        emoji: '🐕',
        generation: 1,
    },
    {
        id: 'lapras',
        name: 'Lapras',
        number: 131,
        types: ['Water', 'Ice'],
        description: 'transport Pokemon resembling a plesiosaur, gentle nature and ferries people across water',
        emoji: '🦕',
        generation: 1,
    },
    {
        id: 'ditto',
        name: 'Ditto',
        number: 132,
        types: ['Normal'],
        description: 'transform Pokemon looking like purple blob, can copy any opponent\'s appearance',
        emoji: '🫠',
        generation: 1,
    },
    {
        id: 'scizor',
        name: 'Scizor',
        number: 212,
        types: ['Bug', 'Steel'],
        description: 'pincer Pokemon with red metallic armor and claws containing eyes',
        emoji: '🦞',
        generation: 2,
    },
    {
        id: 'metagross',
        name: 'Metagross',
        number: 376,
        types: ['Steel', 'Psychic'],
        description: 'iron leg Pokemon with four brains, supercomputer intelligence and metallic body',
        emoji: '🧠',
        generation: 3,
    },
    {
        id: 'groudon',
        name: 'Groudon',
        number: 383,
        types: ['Ground'],
        description: 'continent Pokemon with massive red armored body, expands land and causes droughts',
        emoji: '🌋',
        generation: 3,
    },
    {
        id: 'kyogre',
        name: 'Kyogre',
        number: 382,
        types: ['Water'],
        description: 'sea basin Pokemon resembling a whale, expands oceans and causes heavy rain',
        emoji: '🐋',
        generation: 3,
    },
    {
        id: 'luxray',
        name: 'Luxray',
        number: 405,
        types: ['Electric'],
        description: 'gleam eyes Pokemon resembling a lion using x-ray vision',
        emoji: '🦁',
        generation: 4,
    },
    {
        id: 'chandelure',
        name: 'Chandelure',
        number: 609,
        types: ['Ghost', 'Fire'],
        description: 'luring Pokemon resembling a gothic chandelier with purple flames',
        emoji: '🕯️',
        generation: 5,
    },
    {
        id: 'mimikyu',
        name: 'Mimikyu',
        number: 778,
        types: ['Ghost', 'Fairy'],
        description: 'disguise Pokemon wearing a scribbled Pikachu rag to make friends',
        emoji: '👺',
        generation: 7,
    },
];

// 融合风格配置
export interface FusionStyle {
    id: string;
    name: string;
    prompt: string;
    description: string;
}

export const FUSION_STYLES: FusionStyle[] = [
    {
        id: 'balanced',
        name: 'Balanced',
        prompt: 'balanced fusion combining features equally',
        description: 'Equal blend',
    },
    {
        id: 'cute',
        name: 'Cute',
        prompt: 'cute, adorable, chibi style',
        description: 'Kawaii style',
    },
    {
        id: 'cool',
        name: 'Cool',
        prompt: 'cool, powerful, intimidating',
        description: 'Strong presence',
    },
    {
        id: 'realistic',
        name: 'Realistic',
        prompt: 'realistic, detailed, lifelike',
        description: 'Photorealistic',
    },
    {
        id: 'anime',
        name: 'Anime',
        prompt: 'anime art style, vibrant',
        description: 'Classic anime',
    },
    {
        id: 'custom',
        name: 'Custom',
        prompt: '',
        description: 'No style',
    },
];

// 辅助函数
export function getPokemonById(id: string): Pokemon | undefined {
    return POKEMON_DATABASE.find(p => p.id === id);
}

export function getFusionStyleById(id: string): FusionStyle | undefined {
    return FUSION_STYLES.find(s => s.id === id);
}

// 缺失的函数 1: 随机获取 Pokemon
export function getRandomPokemon(count: number = 2): Pokemon[] {
    const shuffled = [...POKEMON_DATABASE].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// 缺失的函数 2: 构建 Pokemon Prompt
export function buildPokemonPrompt(p1: Pokemon, p2: Pokemon, style?: FusionStyle): string {
    const basePrompt = `A high quality, detailed fusion Pokemon combining features of ${p1.name} and ${p2.name}.`;

    // 组合特征
    const features = `
    Primary body base: ${p1.name} (${p1.description}).
    Secondary features: ${p2.name} (${p2.description}).
    The fusion should seamlessly blend ${p1.name}'s features with ${p2.name}'s elements.
    `;

    // 组合属性
    const types = Array.from(new Set([...p1.types, ...p2.types])).join(' and ');
    const typeDesc = `The creature should reflect the ${types} elemental types.`;

    const stylePrompt = style?.prompt ? `Style: ${style.prompt}.` : '';

    return `${basePrompt} ${features} ${typeDesc} ${stylePrompt} Ken Sugimori art style, official pokemon artwork aesthetic, white background.`;
}
