export interface DBCharacter {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    thumbnailUrl: string; // ✅ Optimized small version for selection list
}

// 使用 Dragon Ball API 官方图片 (类似于 PokeAPI 的解决方案)
// 这些图片经过优化且托管在可靠的服务器上
export const DB_CHARACTERS: DBCharacter[] = [
    {
        id: 'goku',
        name: 'Goku',
        description: 'Saiyan warrior with iconic spiky black hair, wearing orange martial arts gi',
        imageUrl: '/images/dragon-ball/characters/goku.webp',
        thumbnailUrl: '/images/dragon-ball/characters/goku-thumb.webp'
    },
    {
        id: 'vegeta',
        name: 'Vegeta',
        description: 'Saiyan Prince with flame-like upright hair, wearing blue Saiyan battle armor',
        imageUrl: '/images/dragon-ball/characters/vegeta.webp',
        thumbnailUrl: '/images/dragon-ball/characters/vegeta-thumb.webp'
    },
    {
        id: 'piccolo',
        name: 'Piccolo',
        description: 'Namekian warrior with green skin, pointed ears, and weighted white cape',
        imageUrl: '/images/dragon-ball/characters/piccolo.webp',
        thumbnailUrl: '/images/dragon-ball/characters/piccolo-thumb.webp'
    },
    {
        id: 'frieza',
        name: 'Frieza',
        description: 'Galactic tyrant with white and purple bio-armor, sleek design',
        imageUrl: '/images/dragon-ball/characters/frieza.webp',
        thumbnailUrl: '/images/dragon-ball/characters/frieza-thumb.webp'
    },
    {
        id: 'cell',
        name: 'Cell',
        description: 'Bio-android with green spotted exoskeleton, insect-like wings',
        imageUrl: '/images/dragon-ball/characters/cell.webp',
        thumbnailUrl: '/images/dragon-ball/characters/cell-thumb.webp'
    },
    {
        id: 'majin-buu',
        name: 'Majin Buu',
        description: 'Pink magical creature, round body (or muscular Super Buu form), with head tentacle',
        imageUrl: '/images/dragon-ball/characters/majin-buu.webp',
        thumbnailUrl: '/images/dragon-ball/characters/majin-buu-thumb.webp'
    },
    {
        id: 'broly',
        name: 'Broly',
        description: 'Legendary Super Saiyan, massive muscular build, green aura, uncontrollable rage',
        imageUrl: '/images/dragon-ball/characters/broly.webp',
        thumbnailUrl: '/images/dragon-ball/characters/broly-thumb.webp'
    },
    {
        id: 'trunks',
        name: 'Trunks',
        description: 'Half-Saiyan from future, lavender hair, sword user, capsule corp jacket',
        imageUrl: '/images/dragon-ball/characters/trunks.webp',
        thumbnailUrl: '/images/dragon-ball/characters/trunks-thumb.webp'
    },
    {
        id: 'gohan',
        name: 'Gohan',
        description: 'Half-Saiyan scholar warrior, spiky hair, powerful hidden potential',
        imageUrl: '/images/dragon-ball/characters/gohan.webp',
        thumbnailUrl: '/images/dragon-ball/characters/gohan-thumb.webp'
    },
    {
        id: 'beerus',
        name: 'Beerus',
        description: 'God of Destruction, purple cat-like humanoid, Egyptian attire',
        imageUrl: '/images/dragon-ball/characters/beerus.webp',
        thumbnailUrl: '/images/dragon-ball/characters/beerus-thumb.webp'
    },
    {
        id: 'jiren',
        name: 'Jiren',
        description: 'Pride Trooper, grey alien muscular humanoid, massive eyes',
        imageUrl: '/images/dragon-ball/characters/jiren.webp',
        thumbnailUrl: '/images/dragon-ball/characters/jiren-thumb.webp'
    },
    {
        id: 'android-18',
        name: 'Android 18',
        description: 'Female cyborg with blonde hair, denim clothing, cold expression',
        imageUrl: '/images/dragon-ball/characters/android-18.webp',
        thumbnailUrl: '/images/dragon-ball/characters/android-18-thumb.webp'
    },
    {
        id: 'krillin',
        name: 'Krillin',
        description: 'Earth\'s strongest human warrior, bald monk, uses Destructo Disc',
        imageUrl: '/images/dragon-ball/characters/krillin.webp',
        thumbnailUrl: '/images/dragon-ball/characters/krillin-thumb.webp'
    },
    {
        id: 'master-roshi',
        name: 'Master Roshi',
        description: 'Turtle Hermit, elderly martial arts master with sunglasses and white beard',
        imageUrl: '/images/dragon-ball/characters/master-roshi.webp',
        thumbnailUrl: '/images/dragon-ball/characters/master-roshi-thumb.webp'
    },
    {
        id: 'android-17',
        name: 'Android 17',
        description: 'Cyborg warrior with black lapis hair, orange scarf, endless energy',
        imageUrl: '/images/dragon-ball/characters/android-17.webp',
        thumbnailUrl: '/images/dragon-ball/characters/android-17-thumb.webp'
    },
    {
        id: 'bardock',
        name: 'Bardock',
        description: 'Saiyan warrior, Goku\'s father, bears a cross-shaped scar on cheek',
        imageUrl: '/images/dragon-ball/characters/bardock.webp',
        thumbnailUrl: '/images/dragon-ball/characters/bardock-thumb.webp'
    },
    {
        id: 'whis',
        name: 'Whis',
        description: 'Angel attendant, blue skin, white hair, holds a magical staff',
        imageUrl: '/images/dragon-ball/characters/whis.webp',
        thumbnailUrl: '/images/dragon-ball/characters/whis-thumb.webp'
    },
    {
        id: 'vegetto',
        name: 'Vegetto',
        description: 'Potara fusion of Goku and Vegeta, supreme power, blue gi with orange undershirt',
        imageUrl: '/images/dragon-ball/characters/vegetto.webp',
        thumbnailUrl: '/images/dragon-ball/characters/vegetto-thumb.webp'
    },
    {
        id: 'gogeta',
        name: 'Gogeta',
        description: 'Metamoran fusion of Goku and Vegeta, wears black and orange vest',
        imageUrl: '/images/dragon-ball/characters/gogeta.webp',
        thumbnailUrl: '/images/dragon-ball/characters/gogeta-thumb.webp'
    },
    {
        id: 'gotenks',
        name: 'Gotenks',
        description: 'Fusion of Goten and Trunks, wild dual-colored hair, wears fusion vest',
        imageUrl: '/images/dragon-ball/characters/gotenks.webp',
        thumbnailUrl: '/images/dragon-ball/characters/gotenks-thumb.webp'
    },
    {
        id: 'mr-satan',
        name: 'Mr. Satan',
        description: 'World Martial Arts Champion, afro hair, mustache, flashy showman outfit',
        imageUrl: '/images/dragon-ball/characters/mr-satan.webp',
        thumbnailUrl: '/images/dragon-ball/characters/mr-satan-thumb.webp'
    },
    {
        id: 'tenshinhan',
        name: 'Tenshinhan',
        description: 'Three-eyed martial artist, tall, muscular, serious discipline',
        imageUrl: '/images/dragon-ball/characters/tenshinhan.webp',
        thumbnailUrl: '/images/dragon-ball/characters/tenshinhan-thumb.webp'
    },
    {
        id: 'yamcha',
        name: 'Yamcha',
        description: 'Martial artist with scarred face, long hair, uses Wolf Fang Fist',
        imageUrl: '/images/dragon-ball/characters/yamcha.webp',
        thumbnailUrl: '/images/dragon-ball/characters/yamcha-thumb.webp'
    },
    {
        id: 'raditz',
        name: 'Raditz',
        description: 'Saiyan invader with incredibly long spiky black hair, Saiyan armor',
        imageUrl: '/images/dragon-ball/characters/raditz.webp',
        thumbnailUrl: '/images/dragon-ball/characters/raditz-thumb.webp'
    }
];

export interface DBFusionStyle {
    id: string;
    name: string;
    prompt: string;
    description: string;
}

export const DB_FUSION_STYLES: DBFusionStyle[] = [
    {
        id: 'potara',
        name: 'Potara Fusion',
        prompt: 'Potara fusion style (Vegito style), wearing Potara earrings, mixed outfit features',
        description: 'Earrings fusion'
    },
    {
        id: 'dance',
        name: 'Fusion Dance',
        prompt: 'Metamoran fusion style (Gogeta style), wearing Metamoran vest with puffy shoulder pads',
        description: 'Vest & pants'
    },
    {
        id: 'god',
        name: 'Super Saiyan God',
        prompt: 'Super Saiyan God form, red fiery aura, slimmer build, divine presence',
        description: 'Red form'
    },
    {
        id: 'ui',
        name: 'Ultra Instinct',
        prompt: 'Ultra Instinct form, silver hair and eyes, divine blue-silver aura, intense focus',
        description: 'Silver form'
    },
    {
        id: 'ssj4',
        name: 'Super Saiyan 4',
        prompt: 'Super Saiyan 4 form, red fur covering body, primal look, black hair, tail',
        description: 'Primal form'
    },
    {
        id: 'villain',
        name: 'Villainous',
        prompt: 'Dark villainous aura, evil expression, corrupted design, menacing atmosphere',
        description: 'Evil fusion'
    }
];

export const POPULAR_COMBINATIONS = [
    { char1: "Goku", char2: "Vegeta", style: "dance" },
    { char1: "Goku", char2: "Vegeta", style: "potara" },
    { char1: "Trunks", char2: "Gotenks", style: "dance" }, // Gotenks is technically a fusion, but it's a character in the DB
    { char1: "Goku", char2: "Broly", style: "ssj4" },
    { char1: "Frieza", char2: "Cell", style: "villain" },
    { char1: "Piccolo", char2: "Gohan", style: "ui" }
];

export function getRandomCharacters(count: number = 2): DBCharacter[] {
    const shuffled = [...DB_CHARACTERS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export function buildDBPrompt(char1?: DBCharacter, char2?: DBCharacter, style?: DBFusionStyle, customPrompt?: string): string {
    if (!char1 && !char2) return '';

    // 如果只有1个角色
    if (!char2) {
        return `Dragon Ball style character design of ${char1!.name}. ${char1!.description}. ${style?.prompt || ''}. Akira Toriyama art style, cel shaded, 4k resolution, energetic aura. ${customPrompt || ''}`;
    }

    if (!char1) {
        return `Dragon Ball style character design of ${char2.name}. ${char2.description}. ${style?.prompt || ''}. Akira Toriyama art style, cel shaded, 4k resolution, energetic aura. ${customPrompt || ''}`;
    }

    // 融合
    return `A single, coherent Dragon Ball fusion character combining ${char1.name} and ${char2.name}. 
    The fusion should blend features of ${char1.name} (${char1.description}) and ${char2.name} (${char2.description}).
    ${style?.prompt || ''}.
    Akira Toriyama art style, anime cel shading, masterpiece, high quality, 4k, dynamic pose, energetic aura background.
    ${customPrompt || ''}`;
}
