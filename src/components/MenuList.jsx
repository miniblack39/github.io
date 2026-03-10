// Menulist

import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function MenuList({ selectedCategory, setCartItems }) {
  const [products, setProducts] = useState([]);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [quantities, setQuantities] = useState(1);
  const [selectedSubcategory, setSelectedSubcategory] = useState("タレ");

  useEffect(() => {
    const fetchProducts = async () => {
      const ref = collection(db, "products");
      const snapshot = await getDocs(ref);
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(list);
      setProducts(list);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <hr />
      <p>今選んでいるのは{selectedCategory}</p>
      {products
        .filter((p) => p.categoryId === selectedCategory)
        .map((p) => (
          <div
            key={p.id}
            onClick={() => {
              setIsMenuModalOpen(true);
              setSelectedMenuItem(p);
            }}
          >
            <img src={p.imageUrl} alt={p.name} />
            {p.name} - {p.price}円
          </div>
        ))}
      {isMenuModalOpen && (
        <div>
          <p>{selectedMenuItem.name}</p>
          <p>{selectedMenuItem.price}円</p>
          <button
            onClick={() => {
              setQuantities((prev) => (prev < 10 ? prev + 1 : 10));
            }}
          >
            +
          </button>
          <p>{quantities}本</p>
          <button
            onClick={() => {
              setQuantities((prev) => (prev > 0 ? prev - 1 : 0));
            }}
          >
            -
          </button>

          {selectedMenuItem.subOptions.map((option) => (
            <button key={option} onClick={() => setSelectedSubcategory(option)}>
              {option}
            </button>
          ))}

          <button
            onClick={() => {
              setCartItems((prev) => {
                const newCartId = `${selectedMenuItem.id}_${selectedSubcategory}`;
                const existing = prev.find((i) => i.cartId === newCartId);
                if (existing) {
                  return prev.map((i) =>
                    i.cartId === newCartId
                      ? { ...i, quantity: i.quantity + quantities }
                      : i,
                  );
                } else {
                  return [
                    ...prev,
                    {
                      id: selectedMenuItem.id,
                      name: selectedMenuItem.name,
                      price: selectedMenuItem.price,
                      quantity: quantities,
                      subOptions: selectedSubcategory,
                      cartId: newCartId,
                      unit: selectedMenuItem.unit,
                    },
                  ];
                }
              });
              setIsMenuModalOpen(false);
              setQuantities(1);
            }}
          >
            カートに入れる
          </button>
        </div>
      )}
    </div>
  );
}
