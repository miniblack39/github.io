// categorylist

export default function CategoryList({
  categories,
  selectedCategory,
  onCategoryChange,
}) {
  return (
    <div>
      {categories.map((cat) => {
        return (
          <button
            key={cat.id}
            onClick={() => {
              console.log(cat.id);
              onCategoryChange(cat.id);
            }}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
