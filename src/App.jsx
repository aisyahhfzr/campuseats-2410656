import { useEffect, useState } from "react"
import Header from "./components/Header.jsx"
import VendorCard from "./components/VendorCard.jsx"
import Footer from "./components/Footer.jsx"
import MenuList from "./components/MenuList.jsx"
import CartPage from "./components/CartPage.jsx"
import { Loading, ErrorMessage } from "./components/Status.jsx"


function App() {
  // Fetched data: one piece of state for each situation
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0) // bump it to fetch again

  const [selectedVendorId, setSelectedVendorId] = useState(null)
  const [cart, setCart] = useState([]); // lines of { item, qty }
  const [view, setView] = useState("menu") // 'menu' | 'cart' | 'done'
  const [lastOrder, setLastOrder] = useState(null)

  const [searchQuery, setSearchQuery] = useState("")

  // Runs after the first render, and again whenever reloadKey changes.
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetch("/api/vendors.json", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setVendors(data)
        // Keep the vendor the user already picked; otherwise pick the first one.
        setSelectedVendorId((current) => current ?? data[0]?.id ?? null)
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort() // cleanup: cancel an old request
  }, [reloadKey])

  function handleAddToCart(item) {
    setCart((prev) => {
      const existing = prev.find((line) => line.item.id === item.id);
      if (existing) {
        // Already in the cart: copy every line, and add 1 to the matching one
        return prev.map((line) =>
          line.item.id === item.id ? { ...line, qty: line.qty + 1 } : line,
        )
      }
      return [...prev, { item, qty: 1 }]; // new line
    })
  }

  function handleChangeQty(itemId, delta) {
    // delta is +1 or -1
    setCart(
      (prev) =>
        prev
          .map((line) =>
            line.item.id === itemId ? { ...line, qty: line.qty + delta } : line,
          ) //[cite: 3]
          .filter((line) => line.qty > 0), // qty 0 means the line disappears
    )
  }

  function handleRemove(itemId) {
    setCart((prev) => prev.filter((line) => line.item.id !== itemId)); //[cite: 3]
  }
  function handlePlaceOrder(details) {
    const total = cart.reduce(
      (sum, line) => sum + line.item.price * line.qty,
      0,
    ) //
    setLastOrder({ ...details, total });
    setCart([])
    setView("done")
  }
  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);
    const selectedVendor = Array.isArray(vendors) ? vendors.find((v) => v.id === selectedVendorId) : null;

    // Filter menu items based on case-insensitive search
  const filteredMenuItems = selectedVendor?.menu
    ? selectedVendor.menu.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []
    
  let content;
  if (view === "cart") {
    content = (
      <CartPage
        cart={cart}
        onChangeQty={handleChangeQty}
        onRemove={handleRemove}
        onPlaceOrder={handlePlaceOrder}
      />
    )
  } else if (view === "done") {
    content = (
      <section className="card">
        <h2>Order placed</h2>
        <p>
          Thank you, {lastOrder?.name}. Pick up at {lastOrder?.pickupTime}{" "}
          (Mahallah {lastOrder?.mahallah}). Total RM{" "}
          {lastOrder?.total?.toFixed(2)}.
        </p>
        <button className="btn" onClick={() => setView("menu")}>
          Back to menus
        </button>
      </section>
    )
  } else if (loading) {
    content = <Loading />
  } else if (error) {
    content = (
      <ErrorMessage
        message={error}
        onRetry={() => setReloadKey((k) => k + 1)}
      />
    )
  } else {
    content = (
      <>
        {/* your Week 2 vendor cards: map over vendors */}
        <div className="vendor-grid">
          {Array.isArray(vendors) &&vendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              isSelected={vendor.id === selectedVendorId}
              onSelect={setSelectedVendorId}
            />
          ))}
        </div>
        {selectedVendor && (
          <MenuList items={selectedVendor.menu} onAdd={handleAddToCart} />
        )}
      </>
    )
  }
  return (
    <>
      <Header
        cartCount={cartCount}
        onShowMenu={() => setView("menu")}
        onShowCart={() => setView("cart")}
      />
      <main className="container">{content}</main>
      <Footer />
    </>
  )
}
export default App
