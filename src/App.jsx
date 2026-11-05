import { useEffect, useState } from "react"
import Header from "./components/Header.jsx"
import VendorCard from "./components/VendorCard.jsx"
import Footer from "./components/Footer.jsx"
import MenuList from "./components/MenuList.jsx"
import CartPage from "./components/CartPage.jsx"
import { Loading, ErrorMessage } from "./components/Status.jsx"

function App() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [selectedVendorId, setSelectedVendorId] = useState(null)
  const [cart, setCart] = useState([])
  const [view, setView] = useState("menu")
  const [lastOrder, setLastOrder] = useState(null)
  

  const [searchQuery, setSearchQuery] = useState("")
  
  // 1. Added state for dietary tags
  const [selectedDietaryTags, setSelectedDietaryTags] = useState([])

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
        setSelectedVendorId((current) => current ?? data[0]?.id ?? null)
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [reloadKey])

  // 2. Added toggle handler for checkboxes
  function handleToggleDietaryTag(tag) {
    setSelectedDietaryTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  function handleAddToCart(item) {
    setCart((prev) => {
      const existing = prev.find((line) => line.item.id === item.id)
      if (existing) {
        return prev.map((line) =>
          line.item.id === item.id ? { ...line, qty: line.qty + 1 } : line,
        )
      }
      return [...prev, { item, qty: 1 }]
    })
  }

  function handleChangeQty(itemId, delta) {
    setCart(
      (prev) =>
        prev
          .map((line) =>
            line.item.id === itemId ? { ...line, qty: line.qty + delta } : line,
          )
          .filter((line) => line.qty > 0),
    )
  }

  function handleRemove(itemId) {
    setCart((prev) => prev.filter((line) => line.item.id !== itemId))
  }

  function handlePlaceOrder(details) {
    const total = cart.reduce(
      (sum, line) => sum + line.item.price * line.qty,
      0,
    )
    setLastOrder({ ...details, total })
    setCart([])
    setView("done")
  }

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0)
  const selectedVendor = Array.isArray(vendors) ? vendors.find((v) => v.id === selectedVendorId) : null

  //
  // Updated filtering logic using .some()
  const filteredMenuItems = selectedVendor?.menu
    ? selectedVendor.menu.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesTags =
          selectedDietaryTags.length === 0 ||
          selectedDietaryTags.some((tag) => item.tags?.includes(tag) || item.dietary?.includes(tag))
          
        return matchesSearch && matchesTags
      })
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
        <div className="vendor-grid">
          {Array.isArray(vendors) && vendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              isSelected={vendor.id === selectedVendorId}
              onSelect={setSelectedVendorId}
            />
          ))}
        </div>

        {/* Dietary Tag Checkboxes placed cleanly inside the view render */}
        <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0', flexWrap: 'wrap', alignItems: 'center', background: '#fff', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #c5cbd3' }}>
          <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Dietary tags:</span>
          {['Vegetarian', 'Vegan', 'Dairy-Free', 'Gluten-Free', 'Nut-Free'].map((tag) => (
            <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 400 }}>
              <input
                type="checkbox"
                checked={selectedDietaryTags.includes(tag)}
                onChange={() => handleToggleDietaryTag(tag)}
              />
              {tag}
            </label>
          ))}
        </div>

        {selectedVendor && (
          <MenuList items={filteredMenuItems} onAdd={handleAddToCart} />
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