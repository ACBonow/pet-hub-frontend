/**
 * @module lost-found
 * @file useLostFound.ts
 * @description Hook for loading and managing lost & found reports.
 */

import { useState, useRef, useEffect } from 'react'
import {
  listReportsRequest,
  getReportRequest,
  createReportRequest,
  updateLostFoundStatusRequest,
  uploadLostFoundPhotoRequest,
} from '@/modules/lost-found/services/lostFound.service'
import type { LostFoundReport, LostFoundFilters, LostFoundStatus, CreateLostFoundData } from '@/modules/lost-found/types'
import type { ApiError } from '@/shared/types'

interface UseLostFoundResult {
  report: LostFoundReport | null
  reports: LostFoundReport[]
  isLoading: boolean
  error: string | null
  listReports: (filters?: LostFoundFilters) => Promise<void>
  getReport: (id: string) => Promise<void>
  createReport: (data: CreateLostFoundData) => Promise<LostFoundReport>
  updateStatus: (id: string, status: LostFoundStatus) => Promise<void>
  uploadPhoto: (reportId: string, file: File) => Promise<void>
}

export function useLostFound(): UseLostFoundResult {
  const [report, setReport] = useState<LostFoundReport | null>(null)
  const [reports, setReports] = useState<LostFoundReport[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  async function listReports(filters?: LostFoundFilters): Promise<void> {
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    setError(null)
    try {
      const data = await listReportsRequest(filters, controller.signal)
      setReports(data)
    } catch (err) {
      if ((err as ApiError).code === 'REQUEST_CANCELED') return
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao carregar relatórios.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function getReport(id: string): Promise<void> {
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    setError(null)
    try {
      const data = await getReportRequest(id, controller.signal)
      setReport(data)
    } catch (err) {
      if ((err as ApiError).code === 'REQUEST_CANCELED') return
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao carregar relatório.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function createReport(data: CreateLostFoundData): Promise<LostFoundReport> {
    setIsLoading(true)
    setError(null)
    try {
      const created = await createReportRequest(data)
      setReport(created)
      return created
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao criar relatório.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function updateStatus(id: string, status: LostFoundStatus): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const updated = await updateLostFoundStatusRequest(id, status)
      setReport(updated)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao atualizar status.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function uploadPhoto(reportId: string, file: File): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      await uploadLostFoundPhotoRequest(reportId, file)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message ?? 'Erro ao enviar foto.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { report, reports, isLoading, error, listReports, getReport, createReport, updateStatus, uploadPhoto }
}
