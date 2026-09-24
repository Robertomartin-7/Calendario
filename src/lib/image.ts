/** Tamaño que cabe en un cuadrado de `max` píxeles sin ampliar y conservando la proporción. */
export function fitSize(w: number, h: number, max: number): { w: number; h: number } {
  const scale = Math.min(1, max / Math.max(w, h))
  return { w: Math.max(1, Math.round(w * scale)), h: Math.max(1, Math.round(h * scale)) }
}

const MAX_CHARS = 700_000 // el documento de Firestore admite 1 MiB; base64 ocupa ~4/3

/**
 * Redimensiona en el cliente (lado mayor 1200 px, JPEG calidad 0,7) y devuelve un data URL.
 * Si aun así pesa demasiado, baja calidad y tamaño hasta que quepa en un documento de Firestore.
 */
export async function resizeImage(file: File, maxSide = 1200, quality = 0.7): Promise<string> {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.onerror = () => reject(new Error('No se pudo leer la imagen'))
      i.src = url
    })
    let side = maxSide
    let q = quality
    for (let attempt = 0; attempt < 6; attempt++) {
      const { w, h } = fitSize(img.naturalWidth, img.naturalHeight, side)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
      const data = canvas.toDataURL('image/jpeg', q)
      if (data.length <= MAX_CHARS) return data
      q = Math.max(0.4, q - 0.1)
      side = Math.round(side * 0.85)
    }
    throw new Error('La imagen es demasiado pesada')
  } finally {
    URL.revokeObjectURL(url)
  }
}
