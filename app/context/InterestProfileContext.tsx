"use client"
import { createContext, ReactNode, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { InterestProfile } from '@/lib/types';

interface InterestProfileContextType {
    interestProfile: InterestProfile
    loading: boolean
    error: string | null
    loadInterestProfile: () => Promise<void>
    setInterestProfile: React.Dispatch<React.SetStateAction<InterestProfile>>
    setError: React.Dispatch<React.SetStateAction<string | null>>
    isDirty: boolean
    setIsDirty: React.Dispatch<React.SetStateAction<boolean>>
}

const InterestProfileContext = createContext<InterestProfileContextType | null>(null)

export function InterestProfileProvider({ children }: { children: ReactNode }) {
    const [interestProfile, setInterestProfile] = useState<InterestProfile>({
        topics: [],
        geographic_focus: [],
        authors: [],
        keywords: [],
        description: "",
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isDirty, setIsDirty] = useState(false)

    useEffect(()=>{
        loadInterestProfile()
    },[])

    const loadInterestProfile = useCallback(async ()=>{
       try {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/interest_profile")
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? "Failed to load interest profile")
      }
      const data = await res.json()
      console.log("stuff",data.items)
      setInterestProfile(data.items[0])
      setIsDirty(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
    },[])

    const value = useMemo(()=>{
        return {
            interestProfile,
            loading,
            error,
            loadInterestProfile,
            setInterestProfile,
            setError,
            isDirty,
            setIsDirty,
        }
    },[interestProfile,loading,error,loadInterestProfile,setInterestProfile, setError, isDirty, setIsDirty])
    return <InterestProfileContext.Provider value={value}>{children}</InterestProfileContext.Provider>
}

export function useInterestProfile() {
    const context = useContext(InterestProfileContext)
    if (!context) {
        throw new Error("useInterestProfile must be used within a InterestProfileProvider")
    }
    return context
}