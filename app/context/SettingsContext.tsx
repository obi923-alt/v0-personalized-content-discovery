"use client"
import React, { createContext, ReactNode, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { DigestSettings } from '@/lib/types';
import { SettingsRow } from '../api/settings/route';

interface SettingsContextType {
    settings : SettingsRow
    loading : boolean
    error : string | null
    setSettings :  React.Dispatch<React.SetStateAction<SettingsRow>>
    setError : React.Dispatch<React.SetStateAction<string | null>>
    setIsDirty : React.Dispatch<React.SetStateAction<boolean>>
    isDirty : boolean
}

const SettingsContext = createContext<SettingsContextType | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SettingsRow>({
        email: "",
        deliveryTime: "07:00",
        maxItems: 25,
        relevanceThreshold: 70,
        emailNotifications: true,
        paywallBypass: true,
        updatedAt: null,
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isDirty, setIsDirty] = useState(false)

    useEffect(()=>{
        loadSettings()
    },[])

    const loadSettings = useCallback(async ()=>{
       try {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/settings")
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? "Failed to load settings")
      }
      const data = await res.json()
      console.log("all the stuff",data)
      setSettings(data)
      setIsDirty(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
    },[])

    const value = useMemo(()=>{
        return {
            settings,
            loading,
            error,
            setSettings,
            setError,
            isDirty,
            setIsDirty,
        }
    },[settings,loading,error,setSettings,setError, isDirty, setIsDirty])
    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
    const context = useContext(SettingsContext)
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider")
    }
    return context
}