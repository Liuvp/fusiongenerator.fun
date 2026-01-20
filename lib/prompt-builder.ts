import type { Pokemon, FusionStyle } from './pokemon-data';
import crypto from 'crypto';

// ============================================================================
// Layer 1: 系统固定Prompt（写死，不暴露给用户）
// ============================================================================

export const SYSTEM_PROMPT = `masterpiece, best quality, ultra-detailed, official pokemon-style character design, single fused creature, clean silhouette, no text, no watermark, no logo, white or simple background, anime illustration, high consistency`;

export const NEGATIVE_PROMPT = `low quality, blurry, extra limbs, deformed, multiple characters, split body, text, watermark, logo, cropped, duplicate, mutation, unclear face, unclear body, poorly drawn anatomy, deformed body, extra limbs`;

// ============================================================================
// Layer 3: 修饰语白名单系统（分类去重版）
// ============================================================================

const MODIFIER_CATEGORIES = {
    style: {
        'cute': 'cute style, adorable, chibi proportions',
        'cool': 'cool style, powerful stance, intimidating presence',
        'realistic': 'realistic texture, detailed shading, photorealistic',
        'anime': 'anime art style, vibrant colors, dynamic expression',
        'dark': 'dark fantasy style, dramatic shadows, moody atmosphere',
        'fantasy': 'fantasy style, magical effects, ethereal lighting',
    },
    pose: {
        'dynamic': 'dynamic pose, action stance, energetic',
        'calm': 'calm pose, relaxed stance, peaceful',
        'battle': 'battle ready pose, aggressive stance, ready to attack',
    },
    lighting: {
        'epic': 'epic lighting, dramatic composition, cinematic',
        'bright': 'bright colors, cheerful atmosphere, vibrant lighting',
        'mysterious': 'mysterious atmosphere, subtle lighting, enigmatic',
    }
};

// 高质量增强器
const QUALITY_ENHANCERS = [
    "vivid colors",
    "dynamic pose",
    "fantasy lighting",
    "detailed textures",
    "clean silhouette"
];

function parseUserModifiers(userInput: string): string {
    if (!userInput.trim()) return '';

    const input = userInput.toLowerCase();
    const selectedModifiers: string[] = [];

    for (const [categoryName, modifiers] of Object.entries(MODIFIER_CATEGORIES)) {
        for (const [key, value] of Object.entries(modifiers)) {
            if (input.includes(key)) {
                selectedModifiers.push(value);
                break;
            }
        }
    }

    if (selectedModifiers.length > 0) {
        return selectedModifiers.join(', ');
    }

    return userInput
        .replace(/[^\w\s,.-]/g, '')
        .slice(0, 100)
        .trim();
}

/**
 * 构建用户修饰语（Layer 3）
 */
function buildUserModifiers(style?: FusionStyle, customModifiers?: string): string {
    const styleText = style?.prompt ?? '';
    const userMods = customModifiers ? parseUserModifiers(customModifiers) : '';

    // 拼接并去重
    const combined = [styleText, userMods, ...QUALITY_ENHANCERS]
        .filter(Boolean)
        .join(', ')
        .replace(/,\s*,/g, ',')
        .trim();

    return combined;
}

// ============================================================================
// Layer 2: 结构化融合Prompt生成（改进版）
// ============================================================================

export interface FusionWeights {
    bodyWeight?: number;
    traitWeight?: number;
}

/**
 * 构建结构化融合Prompt（Layer 2 - 自然描述版）
 */
function buildStructuredPrompt(
    pokemon1: Pokemon,
    pokemon2: Pokemon
): string {
    return `A single, coherent Pokémon fusion creature that naturally combines the key features of ${pokemon1.name} and ${pokemon2.name}.
The creature should have ${pokemon1.name}'s body and general shape, while incorporating distinct traits, colors, and elemental aspects of ${pokemon2.name}.
Ensure the anatomy is correct, proportions are harmonious, and the design feels like an official Pokémon character.
Full body should be visible, clean silhouette, highly detailed, vibrant colors, dynamic pose, official Pokémon style.`;
}

// ============================================================================
// 主函数：完整Prompt构建
// ============================================================================

export function buildFusionPrompt(
    pokemon1?: Pokemon,
    pokemon2?: Pokemon,
    style?: FusionStyle,
    customModifiers?: string
): string {
    if (!pokemon1 && !pokemon2) return '';

    // 单个Pokemon的情况（带构图约束）
    if (!pokemon1 || !pokemon2) {
        const p = pokemon1 || pokemon2!;
        const userMods = buildUserModifiers(style, customModifiers);
        return `A single Pokémon character design of ${p.name}, ${p.description}, full body, centered composition, ${userMods}`;
    }

    // 两个Pokemon的融合
    const structuredPrompt = buildStructuredPrompt(pokemon1, pokemon2);
    const userModifiers = buildUserModifiers(style, customModifiers);

    return `${structuredPrompt}

${userModifiers}`.trim();
}

/**
 * 生成Prompt Hash（用于缓存和SEO）
 */
export function generatePromptHash(
    pokemon1?: Pokemon,
    pokemon2?: Pokemon,
    style?: FusionStyle
): string {
    if (!pokemon1 || !pokemon2) return '';

    const structuredPrompt = buildStructuredPrompt(pokemon1, pokemon2);
    const content = SYSTEM_PROMPT + structuredPrompt + (style?.prompt || '');

    return crypto
        .createHash('md5')
        .update(content)
        .digest('hex')
        .slice(0, 12);
}

/**
 * 简化版 Prompt（用于UI显示）
 */
export function buildSimplifiedPrompt(
    pokemon1?: Pokemon,
    pokemon2?: Pokemon,
    style?: FusionStyle
): string {
    if (!pokemon1 && !pokemon2) return '';
    if (!pokemon2) return pokemon1!.name;
    if (!pokemon1) return pokemon2!.name;

    const styleName = style?.id !== 'custom' && style?.name ? `, ${style.name.toLowerCase()}` : '';
    return `${pokemon1.name} × ${pokemon2.name}${styleName}`;
}

/**
 * 验证 Pokemon 选择
 */
export function validatePokemonSelection(
    pokemon1?: Pokemon,
    pokemon2?: Pokemon
): { valid: boolean; error?: string } {
    if (!pokemon1 && !pokemon2) return { valid: false, error: 'Please select at least one Pokemon' };
    if (pokemon1 && pokemon2 && pokemon1.id === pokemon2.id) return { valid: false, error: 'Please select different Pokemon for fusion' };
    return { valid: true };
}
