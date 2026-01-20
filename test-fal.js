// 临时测试脚本 - 测试Fal.ai连接
import * as fal from "@fal-ai/serverless-client";

fal.config({
    credentials: "5b3e722f-17e1-4a95-96cd-8afb20fcd8d9:27258415fb393144ec741e5c02b9806e"
});

async function test() {
    try {
        console.log("Testing Fal.ai connection...");

        const result = await fal.subscribe("fal-ai/flux/dev", {
            input: {
                prompt: "a cute pokemon",
                image_size: "square_hd",
                num_inference_steps: 20,
            },
            logs: true,
        });

        console.log("Success! Result:", result);
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
