import { ImageResponse } from "next/og";

export const alt = "Iren Corner — Collabora con noi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(180deg, #f4f7fb 0%, #ffffff 100%)",
          padding: "64px 72px",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            height: 10,
            width: "100%",
            background:
              "linear-gradient(90deg, #ffd100 0%, #ff8200 28%, #da291c 52%, #0033a0 76%, #00b140 100%)",
            borderRadius: 6,
            marginBottom: 56,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontSize: 30,
              color: "#00b140",
              fontWeight: 600,
              marginBottom: 20,
              letterSpacing: "0.02em",
            }}
          >
            Collabora con noi
          </p>
          <h1
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#0033a0",
              lineHeight: 1.1,
              marginBottom: 28,
            }}
          >
            Iren Corner
          </h1>
          <p
            style={{
              fontSize: 34,
              color: "#5a6478",
              lineHeight: 1.35,
              maxWidth: 920,
            }}
          >
            Energia, processi digitali e supporto dedicato per la tua agenzia
          </p>
        </div>
        <p
          style={{
            fontSize: 26,
            color: "#0033a0",
            fontWeight: 600,
          }}
        >
          irencornerita.it
        </p>
      </div>
    ),
    { ...size },
  );
}
