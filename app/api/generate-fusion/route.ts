import { NextRequest, NextResponse } from 'next/server';
import * as fal from "@fal-ai/serverless-client";

// 配置 Fal.ai
fal.config({
    credentials: process.env.FAL_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        console.log('Generating fusion with prompt:', prompt);

        // 调用 Fal.ai FLUX API
        const result: any = await fal.subscribe("fal-ai/flux/dev", {
            input: {
                prompt: prompt,
                image_size: "square_hd",
                num_inference_steps: 28,
                guidance_scale: 3.5,
                num_images: 1,
                enable_safety_checker: true,
            },
            logs: true,
            onQueueUpdate: (update) => {
                if (update.status === "IN_PROGRESS") {
                    console.log('Generation progress:', update.logs);
                }
            },
        });

        console.log('Full result:', JSON.stringify(result, null, 2));

        // 检查返回结构
        let imageUrl: string | undefined;
        if (result.data?.images?.[0]?.url) {
            imageUrl = result.data.images[0].url;
        } else if (result.images?.[0]?.url) {
            imageUrl = result.images[0].url;
        } else if (result.data?.image_url) {
            imageUrl = result.data.image_url;
        } else if (result.image_url) {
            imageUrl = result.image_url;
        } else {
            console.error('Unexpected result structure:', result);
            throw new Error('Invalid response structure from AI service');
        }

        console.log('Image URL:', imageUrl);

        // 返回生成的图片URL
        return NextResponse.json({
            imageUrl: imageUrl,
            prompt: prompt,
        });

    } catch (error: any) {
        console.error('Generation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate image' },
            { status: 500 }
        );
    }
}
