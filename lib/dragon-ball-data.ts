export interface DBCharacter {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
}

// 使用简单的 placeholder 服务，直到有真实图片
// 为了美观，使用 dicebear 或者 ui-avatars
// Fallback to stable UI Avatars with character-specific colors since Wikimedia is unstable/blocked in some regions
const getAvatar = (name: string, bg: string, color: string = 'fff') => `https://ui-avatars.com/api/?name=${name}&background=${bg}&color=${color}&size=200&font-size=0.33&length=1&bold=true`;

export const DB_CHARACTERS: DBCharacter[] = [
    {
        id: 'goku',
        name: 'Goku',
        description: 'Saiyan warrior with iconic spiky black hair, wearing orange martial arts gi',
        imageUrl: getAvatar('Goku', 'F97316') // Orange
    },
    {
        id: 'vegeta',
        name: 'Vegeta',
        description: 'Saiyan Prince with flame-like upright hair, wearing blue Saiyan battle armor',
        imageUrl: getAvatar('Vegeta', '2563EB') // Blue
    },
    {
        id: 'piccolo',
        name: 'Piccolo',
        description: 'Namekian warrior with green skin, pointed ears, and weighted white cape',
        imageUrl: getAvatar('Piccolo', '16A34A') // Green
    },
    {
        id: 'frieza',
        name: 'Frieza',
        description: 'Galactic tyrant with white and purple bio-armor, sleek design',
        imageUrl: getAvatar('Frieza', '9333EA') // Purple
    },
    {
        id: 'cell',
        name: 'Cell',
        description: 'Bio-android with green spotted exoskeleton, insect-like wings',
        imageUrl: getAvatar('Cell', '4ADE80', '000') // Light Green
    },
    {
        id: 'majin-buu',
        name: 'Majin Buu',
        description: 'Pink magical creature, round body (or muscular Super Buu form), with head tentacle',
        imageUrl: getAvatar('Buu', 'F472B6') // Pink
    },
    {
        id: 'broly',
        name: 'Broly',
        description: 'Legendary Super Saiyan, massive muscular build, green aura, uncontrollable rage',
        imageUrl: getAvatar('Broly', '84CC16') // Lime
    },
    {
        id: 'trunks',
        name: 'Trunks',
        description: 'Half-Saiyan from future, lavender hair, sword user, capsule corp jacket',
        imageUrl: getAvatar('Trunks', '818CF8') // Indigo
    },
    {
        id: 'gohan',
        name: 'Gohan',
        description: 'Half-Saiyan scholar warrior, spiky hair, powerful hidden potential',
        imageUrl: getAvatar('Gohan', '6366F1') // Violet
    },
    {
        id: 'beerus',
        name: 'Beerus',
        description: 'God of Destruction, purple cat-like humanoid, Egyptian attire',
        imageUrl: getAvatar('Beerus', '7E22CE') // Dark Purple
    },
    {
        id: 'jiren',
        name: 'Jiren',
        description: 'Pride Trooper, grey alien muscular humanoid, massive eyes',
        imageUrl: getAvatar('Jiren', 'EF4444') // Red
    },
    {
        id: 'android-18',
        name: 'Android 18',
        description: 'Female cyborg with blonde hair, denim clothing, cold expression',
        imageUrl: getAvatar('18', '38BDF8') // Light Blue
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
