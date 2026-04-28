let _key = ''
let _mapId = ''

export function setGoogleMapsKey(key: string): void {
  _key = key
}

export function getGoogleMapsKey(): string {
  return _key
}

export function setGoogleMapsMapId(mapId: string): void {
  _mapId = mapId
}

export function getGoogleMapsMapId(): string {
  return _mapId
}
