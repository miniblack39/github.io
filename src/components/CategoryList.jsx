// categorylist
import Styles from "./CategoryList.module.sass";

export default function CategoryList({
  categories,
  selectedCategory,
  onCategoryChange,
}) {
  return (
    <div className={Styles.categoryList}>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={
            cat.id === selectedCategory ? Styles.btnActive : Styles.btn
          }
          onClick={() => onCategoryChange(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
