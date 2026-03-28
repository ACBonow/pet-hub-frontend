/**
 * @module services-directory
 * @file index.ts
 * @description Public surface of the services-directory module.
 */

export { useServicesDirectory } from './hooks/useServicesDirectory'
export { default as ServiceCard } from './components/ServiceCard'
export { default as ServicesListPage } from './pages/ServicesListPage'
export type {
  ServiceListing,
  ServiceTypeRecord,
  ServiceFilters,
  CreateServiceData,
  UpdateServiceData,
} from './types'
