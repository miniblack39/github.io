// Menulist

import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Styles from "./MenuList.module.sass";

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
    <div className={Styles.menulist}>
      <hr />
      <p>今選んでいるのは{selectedCategory}</p>
      {/* grid表示 */}
      <div className={Styles.grid}>
        {products
          .filter((p) => p.categoryId === selectedCategory)
          .map((p) => (
            <div
              key={p.id}
              className={Styles.card}
              onClick={() => {
                setIsMenuModalOpen(true);
                setSelectedMenuItem(p);
              }}
            >
              <img className={Styles.cardImage} src={p.imageUrl} alt={p.name} />
              <div className={Styles.cardBody}>
                <p className={Styles.cardName}>{p.name}</p>
                <p className={Styles.cardPrice}>{p.price}円</p>
              </div>
            </div>
          ))}
      </div>

      {/*モーダル表示 */}
      {isMenuModalOpen && (
        <div className={Styles.overlay}>
          <div className={Styles.modal}>
            <div className={Styles.modalTop}>
              <div className={Styles.modalLeft}>
                <img
                  className={Styles.modalImage}
                  src={selectedMenuItem.imageUrl}
                  alt={selectedMenuItem.name}
                />
                <button
                  className={Styles.btnClose}
                  onClick={() => {
                    setIsMenuModalOpen(false);
                    setQuantities(1);
                  }}
                >
                  閉じる
                </button>
              </div>
              <div className={Styles.modalInfo}>
                <p className={Styles.modalName}>{selectedMenuItem.name}</p>
                <p className={Styles.modalPrice}>{selectedMenuItem.price}円</p>
                <div className={Styles.subOptions}>
                  {selectedMenuItem.subOptions.map((option) => (
                    <button
                      key={option}
                      className={
                        selectedSubcategory === option
                          ? Styles.btnOptionActive
                          : Styles.btnOption
                      }
                      onClick={() => setSelectedSubcategory(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className={Styles.quantityControl}>
                  <button
                    className={Styles.btnQty}
                    onClick={() =>
                      setQuantities((prev) => (prev < 10 ? prev + 1 : 10))
                    }
                  >
                    ＋
                  </button>
                  <span className={Styles.qtyNumber}>
                    {quantities}
                    {selectedMenuItem.unit}
                  </span>
                  <button
                    className={Styles.btnQty}
                    onClick={() =>
                      setQuantities((prev) => (prev > 1 ? prev - 1 : 1))
                    }
                  >
                    －
                  </button>
                </div>
                <button
                  className={Styles.btnAddToCart}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
