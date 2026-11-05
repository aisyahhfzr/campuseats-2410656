import CartItem from '../components/CartItem.jsx'
import CheckoutForm from '../components/CheckoutForm.jsx'
import { useCart } from '../hooks/useCart.js'

function CartPage() {
    const { cart, changeQty, removeFromCart, updateNote, total } = useCart()

    if (cart.length === 0) {
        return <p className="muted">Your cart is empty. Pick something from a menu first.</p>
    }

    return (
        <div className="cart-layout">
            <div className="card">
                <h3>Your cart</h3>
                <ul className="cart-list">
                    {cart.map((line) => (
                        <CartItem
                            key={line.item.id}
                            line={line}
                            onChangeQty={changeQty}
                            onRemove={removeFromCart}
                            onUpdateNote={updateNote}
                        />
                    ))}
                </ul>
                <p className="cart-total">Total: RM {total.toFixed(2)}</p>
            </div>
            <CheckoutForm />
        </div>
    )
}

export default CartPage