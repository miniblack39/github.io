//会計画面
import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import Styles from "./CheckoutPage.module.sass";

export default function CheckoutPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [tableId, setTableId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [people, setPeople] = useState(2);
  const [tableName, setTableName] = useState("");

  useEffect(() => {
    const fetchTableId = async () => {
      const q = query(
        collection(db, "tables"),
        where("sessionId", "==", sessionId),
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setTableId(snapshot.docs[0].id);
      }
    };
    fetchTableId();
  }, [sessionId]);

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(
        collection(db, "orders"),
        where("tableId", "==", tableId),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    };
    fetchOrders();
  }, [tableId]);

  useEffect(() => {
    const getTable = async () => {
      if (!tableId) return;
      const snap = await getDoc(doc(db, "tables", tableId));
      if (snap.exists()) {
        setTableName(snap.data().name || tableId);
      }
    };
    getTable();
  }, [tableId]);

  const allItems = orders.flatMap((order) => order.items || []);

  const mergedItems = allItems.reduce((acc, item) => {
    const key = item.cartId;
    if (acc[key]) {
      acc[key] = { ...acc[key], quantity: acc[key].quantity + item.quantity };
    } else {
      acc[key] = { ...item };
    }
    return acc;
  }, {});

  const itemList = Object.values(mergedItems).filter(
    (item) => item.quantity > 0,
  );

  const total = itemList.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const perPerson = Math.ceil(total / people);

  const handleCheckout = async () => {
    if (!sessionId) return;

    try {
      await Promise.all(
        orders.map((order) => deleteDoc(doc(db, "orders", order.id))),
      );

      await setDoc(
        doc(db, "tables", tableId),
        {
          status: "finished",
          updatedAt: new Date(),
        },
        { merge: true },
      );

      navigate(`/c/${sessionId}/finish`);
    } catch (e) {
      console.error("お会計エラー:", e);
    }
  };

  return (
    <div className={Styles.container}>
      <h2 className={Styles.title}>お会計</h2>
      <div className={Styles.tableNumber}>
        テーブル: {tableName || "読み込み中..."}
      </div>

      <div className={Styles.itemList}>
        {itemList.map((item) => (
          <div key={item.cartId} className={Styles.itemRow}>
            <div className={Styles.itemNameBlock}>
              <span className={Styles.itemName}>{item.name}</span>
              {item.subOptions && (
                <span className={Styles.itemSub}>({item.subOptions})</span>
              )}
            </div>
            <div className={Styles.itemDetail}>
              <span className={Styles.itemQty}>
                {item.price}円 × {item.quantity}
                {item.unit}
              </span>
              <span className={Styles.itemTotal}>
                {item.price * item.quantity}円
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={Styles.totalArea}>
        <span className={Styles.totalLabel}>合計金額</span>
        <span className={Styles.totalAmount}>{total.toLocaleString()}円</span>
      </div>

      <div className={Styles.splitSection}>
        <span className={Styles.splitTitle}>割り勘計算</span>
        <div className={Styles.splitControl}>
          <button
            className={Styles.btnCircle}
            onClick={() => setPeople((prev) => (prev > 1 ? prev - 1 : 1))}
          >
            －
          </button>
          <span className={Styles.peopleCount}>{people}名</span>
          <button
            className={Styles.btnCircle}
            onClick={() => setPeople((prev) => prev + 1)}
          >
            ＋
          </button>
        </div>
        <p className={Styles.perPersonText}>
          お一人様: {perPerson.toLocaleString()}円
        </p>
      </div>

      <button className={Styles.btnCheckout} onClick={handleCheckout}>
        お支払い確定
      </button>

      <button
        className={Styles.btnBack}
        onClick={() => navigate(`/c/${sessionId}/menu`)}
      >
        メニューに戻る
      </button>
    </div>
  );
}
