import { CartContext } from './cart-context.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

export function CartProvider({ children }) {
    const [cart, setCart] = useLocalStorage('campuseats-cart', [])
    const [orders, setOrders] = useLocalStorage('campuseats-orders', [])

    function addToCart(item, note = '') {
        setCart((prevCart) => {
            const existing = prevCart.find((line) => line.item.id === item.id)
            if (existing) {
                return prevCart.map((line) =>
                    line.item.id === item.id ? { ...line, qty: line.qty + 1 } : line
                )
            }
            return [...prevCart, { item, qty: 1, note }]
        })
    }

    function changeQty(itemId, delta) {
        setCart((prevCart) => {
            return prevCart
                .map((line) => {
                    if (line.item.id === itemId) {
                        return { ...line, qty: line.qty + delta }
                    }
                    return line
                })
                .filter((line) => line.qty > 0)
        })
    }

    function removeFromCart(itemId) {
        setCart((prevCart) => prevCart.filter((line) => line.item.id !== itemId))
    }

    function updateNote(itemId, newNote) {
        setCart((prevCart) =>
            prevCart.map((line) =>
                line.item.id === itemId ? { ...line, note: newNote } : line
            )
        )
    }

    function placeOrder(details) {
        const total = cart.reduce((sum, line) => sum + line.item.price * line.qty, 0)
        const newOrder = { ...details, items: cart, total, id: Date.now(), date: new Date().toISOString() }
        setOrders((prevOrders) => [newOrder, ...prevOrders])
        setCart([]) // Clear cart after order
    }

    const count = cart.reduce((sum, line) => sum + line.qty, 0)
    const total = cart.reduce((sum, line) => sum + line.item.price * line.qty, 0)

    return (
        <CartContext.Provider
            value={{
                cart,
                orders,
                count,
                total,
                addToCart,
                changeQty,
                removeFromCart,
                updateNote,
                placeOrder,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}