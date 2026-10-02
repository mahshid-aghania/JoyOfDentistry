import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Joy of Dentistry";

// Default social sharing image — a clean, branded editorial card.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f3ec",
          color: "#26221e",
          padding: "90px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#6e2435",
          }}
        >
          Joy of Dentistry
        </div>
        <div style={{ fontSize: 92, lineHeight: 1.05, maxWidth: 900 }}>
          Beyond the smile, there is a story.
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 28,
            color: "#7a7268",
          }}
        >
          <span>A bilingual dental lifestyle magazine</span>
          <span style={{ fontSize: 56, color: "#26221e" }}>JoD</span>
        </div>
      </div>
    ),
    size,
  );
}
