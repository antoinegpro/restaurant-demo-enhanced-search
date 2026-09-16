const SPECIFIC_CATEGORIES = ["Starters", "Mains", "Desserts"];
const DIETARY_TAGS = ["vegetarian", "vegan", "gluten-free"];

export default function Menu({
  dishes,
  selectedCategories,
  onCategoryChange,
  selectedDietaryTags,
  onDietaryTagsChange,
  searchQuery,
  onSearchChange,
  onAddToCart,
}) {
  function toggleCategory(cat) {
    if (cat === "All") {
      onCategoryChange([]);
      return;
    }
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    // Selecting every specific category is equivalent to "All" — collapse back to it.
    onCategoryChange(next.length === SPECIFIC_CATEGORIES.length ? [] : next);
  }

  function toggleDietaryTag(tag) {
    onDietaryTagsChange(
      selectedDietaryTags.includes(tag)
        ? selectedDietaryTags.filter((t) => t !== tag)
        : [...selectedDietaryTags, tag]
    );
  }

  const categoryFiltered =
    selectedCategories.length === 0
      ? dishes
      : dishes.filter((dish) => selectedCategories.includes(dish.category));

  const dietaryFiltered =
    selectedDietaryTags.length === 0
      ? categoryFiltered
      : categoryFiltered.filter((dish) => selectedDietaryTags.every((tag) => dish.dietaryTags.includes(tag)));

  const query = searchQuery.trim().toLowerCase();
  const filteredDishes = query
    ? dietaryFiltered.filter(
        (dish) =>
          dish.name.toLowerCase().includes(query) || dish.description.toLowerCase().includes(query)
      )
    : dietaryFiltered;

  return (
    <section className="menu">
      <h2>Menu</h2>

      <input
        type="search"
        className="search-input"
        placeholder="Search dishes by name or description…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search menu"
      />

      <div className="category-filters">
        {["All", ...SPECIFIC_CATEGORIES].map((cat) => {
          const active = cat === "All" ? selectedCategories.length === 0 : selectedCategories.includes(cat);
          return (
            <button
              key={cat}
              className={`filter-btn ${active ? "active" : ""}`}
              onClick={() => toggleCategory(cat)}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="dietary-filters">
        {DIETARY_TAGS.map((tag) => (
          <button
            key={tag}
            className={`filter-btn ${selectedDietaryTags.includes(tag) ? "active" : ""}`}
            onClick={() => toggleDietaryTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {filteredDishes.length === 0 ? (
        <p className="menu-empty">No dishes match your search and filters.</p>
      ) : (
        <div className="dish-grid">
          {filteredDishes.map((dish) => (
            <div key={dish.id} className="dish-card">
              <span className="dish-emoji">{dish.emoji}</span>
              <div className="dish-info">
                <h3>{dish.name}</h3>
                <p>{dish.description}</p>
                <div className="dish-footer">
                  <span className="dish-price">€{dish.price.toFixed(2)}</span>
                  <button className="add-btn" onClick={() => onAddToCart(dish)}>
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
