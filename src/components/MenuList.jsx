import MenuItemCard from './MenuItemCard.jsx'

function MenuList({ items, onAdd, searchQuery, setSearchQuery }) {
  return (
    <div className="menu-section">
      
      

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