import type { LexicalRootContainer } from "../schemas/lexical";
import type { Page } from ".";
import { getPayload } from "payload";
import { config } from "@collectivechange/payload";
import { createImageUrl } from "@website/src/lib/createImageUrl";

export type ContentBlock = {
  id: string;
  columns: Array<{
    size: number;
    richText: LexicalRootContainer;
  }>;
};

export async function getPages(): Promise<Page[]> {
  const payload = await getPayload({ config });
  const pages = await payload.find({
    collection: "pages",
    where: {
      _status: {
        equals: "published",
      },
    }
  });
  // console.dir(pages, { depth: Infinity });

  try {
    return pages.docs.map((doc) => {
      const head: Page["head"] = [];
      if (doc.meta?.title) {
        head.push({
          tag: "title",
          content: doc.meta.title,
        });
        head.push({
          tag: "meta",
          attrs: {
            property: "og:title",
            content: doc.meta.title,
          },
        });
      }
      if (doc.meta?.description) {
        head.push({
          tag: "meta",
          attrs: {
            name: "description",
            content: doc.meta.description,
          },
        });
      }
      if (
        doc.meta?.image && typeof doc.meta.image !== "number" &&
        doc.meta.image.url
      ) {
        head.push({
          tag: "meta",
          attrs: {
            property: "og:image",
            content: createImageUrl(doc.meta.image.url),
          },
        });
      }

      return {
        id: doc.slug === "home" ? "/" : doc.slug || "",
        title: doc.title,
        template: "splash",
        layout: doc.layout as unknown as ContentBlock[],
        head,
        tableOfContents: false,
        sidebar: {
          order: 0,
        },
      } satisfies Page;
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}
