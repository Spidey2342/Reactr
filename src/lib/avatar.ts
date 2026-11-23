/** Reads an image file and returns a small square JPEG data URL, so it is cheap to keep in localStorage. */
export async function fileToAvatar(file: File, size = 128): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const g = canvas.getContext('2d')
  if (!g) throw new Error('canvas unavailable')
  const side = Math.min(bitmap.width, bitmap.height)
  g.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size)
  return canvas.toDataURL('image/jpeg', 0.82)
}

export const AVATARS = ['😎', '😊', '🤓', '🧔🏾', '👩🏾', '👨🏿‍🦱', '👩🏿‍🦱', '🥳', '🤠', '👽', '🤩', '🧑🏽‍🦱']
