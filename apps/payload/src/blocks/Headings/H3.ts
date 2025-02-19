import type { Block } from "payload";

export const H3Block: Block = {
  slug: "h3Block",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: false,
    },
  ],
};
