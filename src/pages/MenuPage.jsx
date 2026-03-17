//注文のメニュー画面
import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import CategoryList from "../components/CategoryList";
import MenuList from "../components/MenuList";
import CartDrawer from "../components/CartDrawer";
import Styles from "./MenuPage.module.sass";

export default function MenuPage() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("yakitori");
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => a.order - b.order);
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const q = query(
        collection(db, "orders"),
        where("tableId", "==", tableId),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrderHistory(data);
    };
    fetchOrderHistory();
  }, [tableId]);

  return (
    <div className={Styles.page}>
      <div className={Styles.header}>
        <button
          className={Styles.btnHistory}
          onClick={() => setIsOrderHistoryOpen(true)}
        >
          注文履歴
        </button>

        <button onClick={() => navigate("/c/1")}>開発用-TOP画面へ</button>
        <button onClick={() => navigate("/staff/orders")}>
          開発用-STAFF画面へ
        </button>

        <button
          className={Styles.btnCheckout}
          disabled={orderHistory.length === 0}
          onClick={() => navigate(`/c/${tableId}/checkout`)}
        >
          お会計
        </button>
      </div>
      {/*メインのメニューエリア*/}

      <div className={Styles.main}>
        <div className={Styles.menuArea}>
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
        </div>
        <div className={Styles.cartArea}>
          <CartDrawer
            cartItems={cartItems}
            setCartItems={setCartItems}
            setIsConfirmModalOpen={setIsConfirmModalOpen}
          />
        </div>
      </div>

      {isConfirmModalOpen && (
        <div className={Styles.overlay}>
          <div className={Styles.modal}>
            <p className={Styles.modalTitle}>注文内容の確認</p>
            {cartItems.map((item) => (
              <div key={item.cartId} className={Styles.modalItem}>
                <span>
                  {item.name} {item.subOptions && `(${item.subOptions})`}
                </span>
                <span>
                  {item.price}円 × {item.quantity}
                  {item.unit}
                </span>
              </div>
            ))}
            <div className={Styles.modalButtons}>
              <button
                className={Styles.btnClose}
                onClick={() => setIsConfirmModalOpen(false)}
              >
                閉じる
              </button>
              <button
                className={Styles.btnConfirm}
                onClick={async () => {
                  const newOrder = {
                    items: cartItems,
                    createdAt: new Date(),
                    tableId: tableId,
                  };
                  await addDoc(collection(db, "orders"), newOrder);
                  setOrderHistory((prev) => [newOrder, ...prev]);
                  setCartItems([]);
                  setIsConfirmModalOpen(false);
                  setIsOrderSuccess(true);
                  setTimeout(() => setIsOrderSuccess(false), 2000);
                }}
              >
                注文確定
              </button>
            </div>
          </div>
        </div>
      )}

      {isOrderSuccess && (
        <div className={Styles.overlay}>
          <div className={Styles.successModal}>
            <p>ご注文を受け付けました。</p>
          </div>
        </div>
      )}

      {isOrderHistoryOpen && (
        <div className={Styles.overlay}>
          <div className={Styles.modal}>
            <p className={Styles.modalTitle}>注文履歴</p>

            {orderHistory.map((order, orderIndex) => (
              <div key={orderIndex}>
                <div className={Styles.orderHeader}>
                  <span className={Styles.orderTime}>
                    注文時刻:{" "}
                    {(() => {
                      const date = order.createdAt?.toDate
                        ? order.createdAt.toDate()
                        : order.createdAt;
                      return date instanceof Date
                        ? date.toLocaleTimeString("ja-JP", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "不明";
                    })()}
                  </span>
                </div>

                {order.items.map((item, index) => (
                  <div key={index}>
                    {item.name}
                    {item.subOptions && ` (${item.subOptions})`}
                    {item.price}円{item.quantity}
                    {item.unit}
                    小計: {item.price * item.quantity}円
                    {item.isServed && " 提供済み"}
                  </div>
                ))}
                <hr />
              </div>
            ))}
          </div>
          <p className={Styles.modalTotal}>
            合計:{" "}
            {orderHistory.reduce(
              (sum, order) =>
                sum +
                (order.items || []).reduce(
                  (s, item) => s + item.price * item.quantity,
                  0,
                ),
              0,
            )}
            円
          </p>

          <div className={Styles.modalButtons}>
            <button
              className={Styles.btnClose}
              onClick={() => setIsOrderHistoryOpen(false)}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
