import { webFactory } from "@/factory/web.factory";
import generateOgImage from "@/seo/og";

const app = webFactory.createApp();

/**
 * GET /api/og?title=Page+Title&width=1200&height=630
 * Returns a PNG Open Graph image generated on the fly.
 */
app.get("/", async (c) => {
  try {
    const q = c.req.query();
    const title = (q.title as string) || "ISSGEO";
    const description = (q.description as string) || undefined;
    const width = q.width ? Number(q.width) : 1200;
    const height = q.height ? Number(q.height) : 630;

    const png = await generateOgImage({ title, description, width, height });

    return c.body(new Uint8Array(png), 200, {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
    });
  } catch (error) {
    console.error("OG generation error:", error);
    return c.json({ message: "Failed to generate image" }, 500);
  }
});

export default app;
