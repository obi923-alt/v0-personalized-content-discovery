'use client'
import React, { createContext, ReactNode, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { DigestItem } from '@/lib/types';

// 1. Define the Interface for the context value for better readability
interface DigestContextType {
    digestItems: DigestItem[]
    setDigestItems: React.Dispatch<React.SetStateAction<DigestItem[]>>
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    limit: number
    setLimit: React.Dispatch<React.SetStateAction<number>>
    total: number
    setTotal: React.Dispatch<React.SetStateAction<number>>
    loading: boolean
    error: string | null
    fetchDigestItems: () => Promise<void>
    saveDigestItem: (id: string) => Promise<void>
}

const DigestContext = createContext<DigestContextType | null>(null)

// 2. Component name must be capitalized (DigestProvider)
export function DigestProvider({ children }: { children: ReactNode }) {
    const [digestItems, setDigestItems] = useState<DigestItem[]>([])
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(20)
    const [total, setTotal] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    // 3. Wrap fetch in useCallback to prevent infinite loops if used in useEffects elsewhere
    const fetchDigestItems = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`/api/digest_items?page=${page}&limit=${limit}`)
            if (!response.ok) throw new Error("Network response was not ok");
            
            const data = await response.json()
            if (data.error) {
                setError(data.error)
            } else {
                setDigestItems(data.items)
                setTotal(data.total)
            }
        } catch (err) {
            setError("Failed to fetch digest items")
        } finally {
            setLoading(false)
        }
    }, [page, limit]) // Fetch triggers whenever page or limit changes

    // 4. Trigger fetch when dependencies change
    useEffect(() => {
        fetchDigestItems()
    }, [fetchDigestItems])

    const saveDigestItem = async (id: string) => {
        try {
            const response = await fetch(`/api/digest_items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })
            const data = await response.json()
            if (data.error) {
                setError(data.error)
            } else {
                // Optimistic UI update or toggle
                setDigestItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === id ? { ...item, saved: !item.saved } : item
                    )
                )
            }
        } catch (err) {
            setError("Failed to save digest item")
        }
    }

    // 5. Memoize the value to prevent unnecessary re-renders of all consumers
    const value = useMemo(() => ({
        digestItems,
        setDigestItems,
        page,
        setPage,
        limit,
        setLimit,
        total,
        setTotal,
        loading,
        error,
        fetchDigestItems,
        saveDigestItem,
    }), [digestItems, page, limit, total, loading, error, fetchDigestItems])

    return <DigestContext.Provider value={value}>{children}</DigestContext.Provider>
}

export function useDigest() {
    const context = useContext(DigestContext)
    if (!context) {
        throw new Error("useDigest must be used within a DigestProvider")
    }
    return context
}