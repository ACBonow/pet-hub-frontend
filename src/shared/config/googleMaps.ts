let _key = ''

export function setGoogleMapsKey(key: string): void {
  _key = key
}

export function getGoogleMapsKey(): string {
  return _key
}
