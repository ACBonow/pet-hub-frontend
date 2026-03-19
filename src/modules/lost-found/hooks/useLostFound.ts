/**
 * @module lost-found
 * @file useLostFound.ts
 * @description Hook for loading and managing lost & found reports.
 */

import { useState } from 'react'
import {
  listReportsRequest,
  getReportRequest,
  createReportRequest,
} from '@/modules/lost-found/services/lostFound.service'
import type { LostFoundReport, LostFoundFilters, CreateLostFoundData } from '@/modules/lost-found/types'
import type { ApiError } from '@/shared/types'

interface UseLostFoundResult {
  report: LostFoundReport | null
  reports: LostFoundReport[]
  isLoading: boolean
  error: string | null
  listReports: (filters?: LostFoundFilters) => Promise<void>
  getReport: (id: string) => Promise<void>
  createReport: (data: CreateLostFoundData) => Promise<void>
}

export function useLostFound(): UseLostFoundResult {
  const [report, setReport] = useState<LostFoundReport | null>(null)
  const [reports, setReports] = useState<LostFoundReport[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function listReports(filters?: LostFoundFilters): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const data = await listReportsRequest(filters)
      setReports(data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao carregar relatórios.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function getReport(id: string): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getReportRequest(id)
      setReport(data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao carregar relatório.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function createReport(data: CreateLostFoundData): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const created = await createReportRequest(data)
      setReport(created)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao criar relatório.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { report, reports, isLoading, error, listReports, getReport, createReport }
}
