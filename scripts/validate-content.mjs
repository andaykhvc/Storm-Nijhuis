import { access } from "node:fs/promises";
import path from "node:path";
import { media, site, getMedia } from "../content/site.ts";
const ids = new Set();
for (const item of media) {
  if (ids.has(item.id)) throw new Error(`Duplicate media id: ${item.id}`);
  ids.add(item.id);
  if (!item.alt || !item.title || item.width <= 0 || item.height <= 0)
    throw new Error(`Incomplete media: ${item.id}`);
  if (!item.src.startsWith("/media/") || item.src.includes(".."))
    throw new Error(`Invalid local media source: ${item.src}`);
  await access(path.join(process.cwd(), "public", item.src));
}
for (const id of [...Object.values(site.home), ...site.lookbook]) getMedia(id);
for (const entry of [...site.socials, ...site.press]) {
  if (new URL(entry.href).protocol !== "https:")
    throw new Error("External links must use HTTPS");
}
console.log(
  `Validated ${media.length} media files, all curation assignments and external links.`,
);
