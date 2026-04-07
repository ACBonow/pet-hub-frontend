export interface CompressOptions {
  maxSizeMB?: number
  maxWidthPx?: number
}

/**
 * Compresses an image File using the Canvas API.
 * Returns the original file unchanged if it is already within the size limit.
 *
 * @param file - Image File to compress.
 * @param options - maxSizeMB (default 1), maxWidthPx (default 1200).
 */
export async function compressImage(file: File, options?: CompressOptions): Promise<File> {
  const maxSizeBytes = (options?.maxSizeMB ?? 1) * 1024 * 1024
  const maxWidthPx = options?.maxWidthPx ?? 1200

  if (file.size <= maxSizeBytes) return file

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img
      if (width > maxWidthPx) {
        height = Math.round((height * maxWidthPx) / width)
        width = maxWidthPx
      }

      const canvas = document.createElement('canvas') as HTMLCanvasElement
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Compression failed'))
            return
          }
          resolve(new File([blob], file.name, { type: file.type }))
        },
        file.type,
        0.85,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}
