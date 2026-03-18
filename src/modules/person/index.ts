/**
 * @module person
 * @file index.ts
 * @description Public surface of the person module.
 */

export { usePerson } from './hooks/usePerson'
export * from './types'
export { default as PersonProfile } from './components/PersonProfile'
export { default as ProfilePage } from './pages/ProfilePage'
