import { useState } from "react"
import { useParams, Link, useSearchParams } from "react-router"
import MenuList from "../components/MenuList.jsx"
import { useVendors } from "../hooks/useVendors.js"
import { useCart } from "../hooks/useCart.js"

export default function VendorPage() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const { vendors, loading } = useVendors ? useVendors() : { vendors: [], loading: false }
  const { addToCart } = useCart ? useCart() : { addToCart: () => {} }

  const [searchQuery, setSearchQuery] = useState("")

  // Read dietary tags from URL search params (e.g., ?tags=Vegetarian,Vegan)
  const tagsParam = searchParams.get("tags")
  const selectedDietaryTags = tagsParam ? tagsParam.split(",") : []

  // Toggle tag and update URL search params
  function handleToggleDietaryTag(tag) {
    let updatedTags
    if (selectedDietaryTags.includes(tag)) {
      updatedTags = selectedDietaryTags.filter((t) => t !== tag)
    } else {
      updatedTags = [...selectedDietaryTags, tag]
    }

    // Set or remove the 'tags' query parameter in the URL
    setSearchParams((prev) => {
      if (updatedTags.length > 0) {
        prev.set("tags", updatedTags.join(","))
      } else {
        prev.delete("tags")
      }
      return prev
    })
  }

  const selectedVendor = Array.isArray(vendors) 
    ? vendors.find((v) => v.id === id) 
    : null

  if (!loading && !selectedVendor) {
    return (
      <div className="card">
        <h2>Vendor not found</h2>
        <p>The vendor you are looking for does not exist.</p>
        <Link to="/" className="btn">Back to Vendors</Link>
      </div>
    )
  }

  const filteredMenuItems = selectedVendor?.menu
    ? selectedVendor.menu.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesTags =
          selectedDietaryTags.length === 0 ||
          selectedDietaryTags.some((tag) => item.tags?.includes(tag) || item.dietary?.includes(tag))
        return matchesSearch && matchesTags
      })
    : []

  return (
    <div>
      {loading ? (
        <p>Loading vendor...</p>
      ) : (
        selectedVendor && (
          <>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h2>{selectedVendor.name}</h2>
              <p>{selectedVendor.location}</p>
              <p>Hours: {selectedVendor.openHours}</p>
            </div>

            {/* Dietary Tag Checkboxes */}
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

            <MenuList items={filteredMenuItems} onAdd={addToCart} />
          </>
        )
      )}
    </div>
  )
}