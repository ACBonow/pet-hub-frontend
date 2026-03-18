import '@testing-library/jest-dom'

// Polyfill TextEncoder/TextDecoder for jsdom
import { TextEncoder, TextDecoder } from 'util'
Object.assign(global, { TextDecoder, TextEncoder })

// Polyfill Fetch API Request for jsdom (required by react-router v7)
// jsdom does not include the Fetch API; this minimal shim satisfies react-router's navigation logic.
if (typeof global.Request === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(global as any).Request = class MockRequest {
    url: string
    method: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headers: Record<string, any>

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(url: string, init?: { method?: string; headers?: Record<string, any> }) {
      this.url = typeof url === 'string' ? url : String(url)
      this.method = init?.method ?? 'GET'
      this.headers = init?.headers ?? {}
    }

    clone() {
      return new (global as any).Request(this.url, { method: this.method, headers: this.headers })
    }
  }
}
