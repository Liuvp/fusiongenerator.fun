import type { Pokemon, FusionStyle } from './pokemon-data';

// 质量关键词常量
const QUALITY_KEYWORDS = 'digital art, Pokemon official artwork style, vibrant colors, detailed character design, clean lines, full body visible, dynamic pose, white background, high quality';

/**
 * 构建 Pokemon 融合的 AI Prompt
 */
export function buildFusionPrompt(
    pokemon1?: Pokemon,
    pokemon2?: Pokemon,
    style?: FusionStyle,
    customModifiers?: string
): string {
    if (!pokemon1 && !pokemon2) return '';

    // 获取风格文本
    const styleText = style?.prompt ? `, ${style.prompt}${style?.id !== 'custom' ? ' style' : ''}` : '';

    // 获取自定义修饰
    const customText = customModifiers ? `, ${customModifiers}` : '';

    // 单个 Pokemon
    if (!pokemon1 || !pokemon2) {
        const p = pokemon1 || pokemon2!;
        return `A Pokemon character ${p.name}, ${p.description}${styleText}, ${QUALITY_KEYWORDS}${customText}`;
    }

    // 两个 Pokemon 的融合
    const fusionDesc = `A creative fusion Pokemon that combines ${pokemon1.name} and ${pokemon2.name}, blending characteristics of both creatures`;
    const visualDetails = `featuring elements from ${pokemon1.name} (${pokemon1.types.join(', ')}) and ${pokemon2.name} (${pokemon2.types.join(', ')})`;

    return `${fusionDesc}, ${visualDetails}${styleText}, ${QUALITY_KEYWORDS}${customText}`;
}

/**
 * 简化版 Prompt（用于显示）
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
