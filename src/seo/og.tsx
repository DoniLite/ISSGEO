import satori from "satori";
import sharp from "sharp";

type OgOptions = {
	title: string;
	description?: string;
	width?: number;
	height?: number;
};

/**
 * Generate an Open Graph image (PNG buffer) from a title.
 * Requires `satori` and `sharp` installed. This is a simple example
 * you can extend to include brand, logo, fonts, etc.
 */
export async function generateOgImage({ title, description, width = 1200, height = 630, }: OgOptions) {
  const svg = await satori(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "#0f172a",
        color: "#fff",
        fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto',
      }}
    >
      <div style={{ padding: 48, textAlign: "center", maxWidth: 1050 }}>
        <div style={{ fontSize: 28, opacity: 0.85, marginBottom: 12 }}>ISSGEO</div>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.05 }}>{title}</div>
        {description ? (
          <div style={{ marginTop: 18, fontSize: 28, opacity: 0.85, maxWidth: 1000 }}>{description}</div>
        ) : null}
      </div>
    </div>,
    { width, height, fonts: [] },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return png;
}

export default generateOgImage;
