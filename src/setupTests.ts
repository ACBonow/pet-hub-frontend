import '@testing-library/jest-dom'

// Polyfill TextEncoder/TextDecoder for jsdom
import { TextEncoder, TextDecoder } from 'util'
Object.assign(global, { TextDecoder, TextEncoder })
