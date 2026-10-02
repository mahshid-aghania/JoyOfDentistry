/** Read width/height from a PNG buffer's IHDR chunk. */
export function pngDimensions(
  buf: Uint8Array,
): { width: number; height: number } | null {
  // PNG signature (8 bytes) + "IHDR" length(4)+type(4); width/height are the
  // two 32-bit big-endian integers starting at byte 16.
  if (buf.length < 24) return null;
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < 8; i++) if (buf[i] !== sig[i]) return null;
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const width = view.getUint32(16, false);
  const height = view.getUint32(20, false);
  if (!width || !height) return null;
  return { width, height };
}
