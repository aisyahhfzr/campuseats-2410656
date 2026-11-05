import { useCart } from '../hooks/useCart.js'

function OrdersPage() {
    const { orders } = useCart()

    return (
        <div>
            <h2>My Orders</h2>
            {orders.length === 0 ? (
                <p className="muted">No past orders yet.</p>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="card" style={{ marginBottom: '1rem' }}>
                        <p><strong>Order ID:</strong> {order.id}</p>
                        <p><strong>Name:</strong> {order.name} ({order.mahallah})</p>
                        <p><strong>Pickup Time:</strong> {order.pickupTime}</p>
                        <p><strong>Total:</strong> RM {order.total.toFixed(2)}</p>
                        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
                            {order.items.map((line, idx) => (
                                <li key={idx}>
                                    {line.item.name} x {line.qty} {line.note && `(Note: ${line.note})`}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    )
}

export default OrdersPage