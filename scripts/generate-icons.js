const { ImageResponse } = require("next/og");
const React = require("react");
const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "..", "public");

function waveIcon(strokeWidth) {
  return React.createElement(
    "svg",
    { width: "70%", height: "70%", viewBox: "0 0 100 100", fill: "none" },
    React.createElement("polyline", {
      points: "0,55 18,55 28,25 40,82 52,30 64,68 76,55 100,55",
      stroke: "white",
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "none",
    })
  );
}

function background(children, { maskable } = {}) {
  return React.createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f97316 0%, #b91c1c 100%)",
        borderRadius: maskable ? 0 : "18%",
      },
    },
    children
  );
}

async function writeIcon(sizePx, fileName, { strokeWidth = 9, maskable = false } = {}) {
  const element = background(waveIcon(strokeWidth), { maskable });
  const image = new ImageResponse(element, { width: sizePx, height: sizePx });
  const buffer = Buffer.from(await image.arrayBuffer());
  fs.writeFileSync(path.join(PUBLIC_DIR, fileName), buffer);
  console.log(`wrote ${fileName} (${buffer.length} bytes)`);
}

async function main() {
  await writeIcon(192, "icon-192.png", { strokeWidth: 9 });
  await writeIcon(512, "icon-512.png", { strokeWidth: 8 });
  // Maskable icons are cropped into a circle/squircle by the OS, so keep the
  // artwork well inside the safe zone (smaller relative stroke width is fine
  // since the wave already sits within 70% of the canvas).
  await writeIcon(512, "icon-maskable-512.png", { strokeWidth: 8, maskable: true });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
