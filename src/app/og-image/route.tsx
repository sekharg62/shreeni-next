import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/siteConfig";

// Default share image (1200×630) for pages without their own photo — WhatsApp, Facebook, X, LinkedIn.
// Built once at build time.
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #650f25 0%, #3d0816 100%)",
          color: "#fffdf9",
          fontFamily: "serif",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 10, textTransform: "uppercase", color: "#d8b46a" }}>
          Handwoven in Bengal
        </div>
        <div style={{ fontSize: 150, fontWeight: 700, marginTop: 16, lineHeight: 1 }}>{siteConfig.name}</div>
        <div style={{ width: 120, height: 4, background: "#d8b46a", marginTop: 36 }} />
        <div style={{ fontSize: 40, marginTop: 36, opacity: 0.9, textAlign: "center" }}>{siteConfig.tagline}</div>
        <div style={{ fontSize: 26, marginTop: 28, opacity: 0.7 }}>
          Baluchori · Jamdani · Tant · Kantha · Bengal silks
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
