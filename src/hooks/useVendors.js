import { useState, useEffect } from 'react'

export function useVendors() {
    const [vendors, setVendors] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [reloadKey, setReloadKey] = useState(0)

    const reload = () => setReloadKey((prev) => prev + 1)

    useEffect(() => {
        const controller = new AbortController()
        setLoading(true)
        setError(null)

        fetch('/api/vendors.json', { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
            })
            .then((data) => {
                setVendors(data)
            })
            .catch((err) => {
                if (err.name !== 'AbortError') setError(err.message)
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false)
            })

        return () => controller.abort()
    }, [reloadKey])

    return { vendors, loading, error, reload }
}