'use client'
import React, { createContext, ReactNode, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Source } from '@/lib/types';

interface SourcesContextType {
    sources: Source[]
    loading: boolean
    error: string | null
    loadSources: () => Promise<void>
    setSources: React.Dispatch<React.SetStateAction<Source[]>>
    setError: React.Dispatch<React.SetStateAction<string | null>>

}

const SourcesContext = createContext<SourcesContextType | null>(null)

export function SourcesProvider({ children }: { children: ReactNode }) {
    const [sources, setSources] = useState<Source[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(()=>{
        loadSources()
    },[])

    const loadSources = useCallback(async ()=>{
       try {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/sources")
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? "Failed to load sources")
      }
      const data: Source[] = await res.json()
      setSources(
        data.map((s) => ({
          ...s,
          lastFetched: s.lastFetched ? new Date(s.lastFetched) : undefined,
        }))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
    },[])

    const value = useMemo(()=>{
        return {
            sources,
            loading,
            error,
            loadSources,
            setSources,
            setError,
        }
    },[sources,loading,error,loadSources,setSources, setError])
    return <SourcesContext.Provider value={value}>{children}</SourcesContext.Provider>
}

export function useSources() {
    const context = useContext(SourcesContext)
    if (!context) {
        throw new Error("useSources must be used within a DigestProvider")
    }
    return context
}
