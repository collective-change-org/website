import { z } from "astro:schema";
import { lexicalRootContainer } from "./lexical";

export const blockBanner = z.object({
    id: z.string(),
    style: z.union([
        z.literal("info"),
        z.literal("warning"),
    ]),
    content: lexicalRootContainer,
    blockType: z.literal("banner"),
});