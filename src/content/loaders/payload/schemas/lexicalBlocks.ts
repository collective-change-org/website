import { z } from "astro:schema";
import { lexicalRootContainer } from "./lexical";

export const blockBanner = z.object({
    id: z.string(),
    style: z.union([
        z.literal("info"),
        z.literal("warning"),
    ]),
    content: z.any(),
    blockType: z.literal("banner"),
});

export const blockCode = z.object({
    id: z.string(),
    code: z.string(),
    language: z.string(),
    blockName: z.string(),
    blockType: z.literal("code"),
})