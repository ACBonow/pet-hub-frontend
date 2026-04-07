import { compressImage } from '@/shared/utils/image'

// ── Mocks globais ─────────────────────────────────────────────────────────────

URL.createObjectURL = jest.fn(() => 'blob:mock-url')
URL.revokeObjectURL = jest.fn()

const mockDrawImage = jest.fn()
const mockGetContext = jest.fn()
const mockToBlob = jest.fn()
const mockCanvas = {
  width: 0,
  height: 0,
  getContext: mockGetContext,
  toBlob: mockToBlob,
}

const originalCreateElement = document.createElement.bind(document)

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeFile(sizeBytes: number, name = 'foto.jpg', type = 'image/jpeg'): File {
  return new File([new Uint8Array(sizeBytes)], name, { type })
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('compressImage', () => {
  let mockImage: {
    src: string
    width: number
    height: number
    onload: (() => void) | null
    onerror: (() => void) | null
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockCanvas.width = 0
    mockCanvas.height = 0
    mockGetContext.mockReturnValue({ drawImage: mockDrawImage })

    mockImage = { src: '', width: 2000, height: 1000, onload: null, onerror: null }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global as any).Image = jest.fn().mockReturnValue(mockImage)

    jest.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'canvas') return mockCanvas as unknown as HTMLElement
      return originalCreateElement(tag)
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('retorna o arquivo sem alteração quando tamanho ≤ 1 MB', async () => {
    const file = makeFile(500 * 1024) // 500 KB
    const result = await compressImage(file)
    expect(result).toBe(file)
    expect(URL.createObjectURL).not.toHaveBeenCalled()
  })

  it('retorna sem alteração com limite personalizado', async () => {
    const file = makeFile(800 * 1024) // 800 KB
    const result = await compressImage(file, { maxSizeMB: 2 })
    expect(result).toBe(file)
  })

  it('comprime arquivo grande via canvas e retorna File', async () => {
    const file = makeFile(2 * 1024 * 1024) // 2 MB
    const blob = new Blob(['comprimido'], { type: 'image/jpeg' })
    mockToBlob.mockImplementation((cb: (b: Blob) => void) => cb(blob))

    const promise = compressImage(file)
    mockImage.onload!()

    const result = await promise
    expect(result).toBeInstanceOf(File)
    expect(result.name).toBe(file.name)
    expect(mockGetContext).toHaveBeenCalledWith('2d')
    expect(mockDrawImage).toHaveBeenCalled()
  })

  it('escala largura para maxWidthPx mantendo proporção (2000×1000 → 1200×600)', async () => {
    const file = makeFile(2 * 1024 * 1024)
    mockToBlob.mockImplementation((cb: (b: Blob) => void) => cb(new Blob(['x'])))

    const promise = compressImage(file)
    mockImage.onload!()
    await promise

    expect(mockCanvas.width).toBe(1200)
    expect(mockCanvas.height).toBe(600)
  })

  it('não escala quando largura ≤ maxWidthPx', async () => {
    const file = makeFile(2 * 1024 * 1024)
    mockImage.width = 800
    mockImage.height = 600
    mockToBlob.mockImplementation((cb: (b: Blob) => void) => cb(new Blob(['x'])))

    const promise = compressImage(file)
    mockImage.onload!()
    await promise

    expect(mockCanvas.width).toBe(800)
    expect(mockCanvas.height).toBe(600)
  })

  it('revoga o object URL após compressão bem-sucedida', async () => {
    const file = makeFile(2 * 1024 * 1024)
    mockToBlob.mockImplementation((cb: (b: Blob) => void) => cb(new Blob(['x'])))

    const promise = compressImage(file)
    mockImage.onload!()
    await promise

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
  })

  it('rejeita quando o contexto do canvas não está disponível', async () => {
    const file = makeFile(2 * 1024 * 1024)
    mockGetContext.mockReturnValueOnce(null)

    const promise = compressImage(file)
    mockImage.onload!()

    await expect(promise).rejects.toThrow('Canvas context not available')
  })

  it('rejeita quando toBlob retorna null', async () => {
    const file = makeFile(2 * 1024 * 1024)
    mockToBlob.mockImplementation((cb: (b: Blob | null) => void) => cb(null))

    const promise = compressImage(file)
    mockImage.onload!()

    await expect(promise).rejects.toThrow('Compression failed')
  })

  it('rejeita e revoga URL quando a imagem falha ao carregar', async () => {
    const file = makeFile(2 * 1024 * 1024)

    const promise = compressImage(file)
    mockImage.onerror!()

    await expect(promise).rejects.toThrow('Failed to load image')
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
  })
})
