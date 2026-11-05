import { useEffect, useState } from 'react'

// Step 1: a custom hook. Same shape as useState, but the value survives a page refresh.
export function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        try {
            const saved = localStorage.getItem(key)
            return saved !== null ? JSON.parse(saved) : initialValue
        } catch (error) {
            console.error('Error reading localStorage key "${key}":', error)
            return initialValue
        }
    })

 useEffect(() => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (error){
        console.error('Error setting localStorage key "${key}":', error)
    }
}, [key, value])

return [value, setValue]

}