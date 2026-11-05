import VendorCard from '../components/VendorCard.jsx'
import { useVendors } from '../hooks/useVendors.js'

function HomePage() {
    const { vendors, loading, error } = useVendors()

    if (loading) return <p>Loading vendors...</p>
    if (error) return <p className="field-error">Error loading vendors: {error}</p>

    return (
        <div>
            <h2 className="section-title">Choose a vendor</h2>
            <div className="vendor-grid">
                {vendors.map((vendor) => (
                    <VendorCard key={vendor.id} vendor={vendor} />
                ))}
            </div>
        </div>
    )
}

export default HomePage