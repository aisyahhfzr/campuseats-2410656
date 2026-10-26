import MenuItemCard from './MenuItemCard.jsx'

function MenuList({ items, onAdd, searchQuery, setSearchQuery }) {
  return (
    <div className="menu-section">
      {/* Styled Search Bar Bar */}
      <div className="search-bar">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button 
            type="button" 
            className="clear-btn" 
            onClick={() => setSearchQuery("")}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="muted empty-state">No menu items match "{searchQuery}".</p>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} onAdd={onAdd} />
          ))}
        </div>
      )}
    </div>
  )
}

export default MenuList