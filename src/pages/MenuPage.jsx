//注文のメニュー画面
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import CategoryList from "../components/CategoryList";
import MenuList from "../components/MenuList";
import CartDrawer from "../components/CartDrawer";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("limited");
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => a.order - b.order);
      setCategories(data);
    };
    fetchCategories();
  }, []);
  console.log(cartItems);
  return (
    <div>
      <h2>カテゴリー確認用</h2>

      <hr />
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <MenuList
        selectedCategory={selectedCategory}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
      <CartDrawer
        cartItems={cartItems}
        setCartItems={setCartItems}
        setIsConfirmModalOpen={setIsConfirmModalOpen}
      />

      {isConfirmModalOpen && (
        <div>
          {cartItems.map((item) => (
            <div key={item.cartId}>
              {item.name}
              {item.subOptions}
              {item.price}
              {item.quantity}
              {item.unit}
            </div>
          ))}
          <button
            onClick={async () => {
              await addDoc(collection(db, "orders"), {
                items: cartItems,
                createdAt: new Date(),
              });
              setCartItems([]);
              setIsConfirmModalOpen(false);
            }}
          >
            注文確定
          </button>
          <button onClick={() => setIsConfirmModalOpen(false)}>閉じる</button>
        </div>
      )}
    </div>
  );
}
