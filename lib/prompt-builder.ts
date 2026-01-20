import type { Pokemon, FusionStyle } from './pokemon-data';
import crypto from 'crypto';

// ============================================================================
// Layer 1: 系统固定Prompt（写死，不暴露给用户）
// ============================================================================

export const SYSTEM_PROMPT = `masterpiece, best quality, ultra-detailed, official pokemon-style character design, single fused creature, clean silhouette, no text, no watermark, no logo, white or simple background, anime illustration, high consistency`;

export const NEGATIVE_PROMPT = `low quality, blurry, extra limbs, deformed, multiple characters, split body, text, watermark, logo, cropped, duplicate, mutation, unclear face, unclear body`;

// ============================================================================
// Layer 3: 修饰语白名单系统（分类去重版）
// ============================================================================

// 修饰语分类（每个类别只取第一个匹配，防止风格冲突）
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

/**
 * 解析用户输入，映射到白名单修饰语（分类去重版）
 * 每个类别只取第一个匹配，防止"cute and dark"这种冲突
 */
function parseUserModifiers(userInput: string): string {
    if (!userInput.trim()) return '';

    const input = userInput.toLowerCase();
    const selectedModifiers: string[] = [];

    // 每个类别只取第一个匹配
    for (const [categoryName, modifiers] of Object.entries(MODIFIER_CATEGORIES)) {
        for (const [key, value] of Object.entries(modifiers)) {
            if (input.includes(key)) {
                selectedModifiers.push(value);
                break; // 找到第一个就跳出该类别
            }
        }
    }

    // 如果有匹配，返回白名单；否则返回清理后的原始输入
    if (selectedModifiers.length > 0) {
        return selectedModifiers.join(', ');
    }

    // 兜底：清理用户输入，只保留安全字符
    return userInput
        .replace(/[^\w\s,.-]/g, '')  // 移除特殊字符
        .slice(0, 100)                // 限制长度
        .trim();
}

// ============================================================================
// Layer 2: 结构化融合Prompt生成
// ============================================================================

export interface FusionWeights {
    bodyWeight?: number;    // 默认 0.7
    traitWeight?: number;   // 默认 0.3
}

/**
 * 构建结构化融合Prompt（Layer 2）
 * 添加了 anatomy 约束以提升 FLUX 生成质量
 */
function buildStructuredPrompt(
    pokemon1: Pokemon,
    pokemon2: Pokemon,
    weights: FusionWeights = {}
): string {
    const bodyWeight = weights.bodyWeight || 0.7;
    const traitWeight = weights.traitWeight || 0.3;

    const bodyPercent = Math.round(bodyWeight * 100);
    const traitPercent = Math.round(traitWeight * 100);

    return `A pokemon fusion creature combining:
- primary body structure (${bodyPercent}%) and facial features of ${pokemon1.name}
- secondary traits (${traitPercent}%), ${pokemon2.types.join('/')} elemental effects, and color palette of ${pokemon2.name}

The fusion should feel natural and balanced, not two characters merged side by side.
The result should be a single coherent creature with unified anatomy and proportions.`;
}

// ============================================================================
// 主函数：完整Prompt构建
// ============================================================================

/**
 * 构建完整的三层Prompt
 * @returns 用于发送给AI的完整prompt（不包括系统层，系统层在API route拼接）
 */
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
        const styleText = style?.prompt || '';
        const userMods = customModifiers ? parseUserModifiers(customModifiers) : '';

        // 单体也加构图约束（SEO页面更稳定）
        return `A single pokemon character design of ${p.name}, ${p.description}, full body, centered composition, ${styleText}, ${userMods}`.trim();
    }

    // Layer 2: 结构化融合描述
    const structuredPrompt = buildStructuredPrompt(pokemon1, pokemon2);

    // Layer 3: 风格 + 用户修饰（去重处理）
    const styleText = style?.prompt || '';
    const userModifiers = customModifiers ? parseUserModifiers(customModifiers) : '';

    // 合并并去重（防止"anime style"重复）
    const combinedModifiers = [styleText, userModifiers]
        .filter(Boolean)
        .join(', ')
        .replace(/,\s*,/g, ',')  // 清理多余逗号
        .trim();

    // 拼接 Layer 2 + Layer 3
    return `${structuredPrompt}

${combinedModifiers}`.trim();
}

/**
 * 生成Prompt Hash（用于缓存和SEO）
 * 包含weights以支持未来的比例可配置
 */
export function generatePromptHash(
    pokemon1?: Pokemon,
    pokemon2?: Pokemon,
    style?: FusionStyle,
    weights?: FusionWeights
): string {
    if (!pokemon1 || !pokemon2) return '';

    const structuredPrompt = buildStructuredPrompt(pokemon1, pokemon2, weights);
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
