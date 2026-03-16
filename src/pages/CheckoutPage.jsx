//会計画面
import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [people, setPeople] = useState(2);

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
  }, []);

  const handleCheckout = async () => {
    await Promise.all(
      orders.map((order) => deleteDoc(doc(db, "orders", order.id))),
    );
    await setDoc(doc(db, "tables", tableId), {
      status: "finished",
      updatedAt: new Date(),
    });
    navigate(`/c/${tableId}/finish`);
  };

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

  return (
    <div>
      <h2>お会計</h2>
      <h3>テーブル: {tableId}</h3>

      {itemList.map((item) => (
        <div key={item.cartId}>
          {item.name}
          {item.subOptions && ` (${item.subOptions})`}
          {item.price}円 × {item.quantity}
          {item.unit}
          小計: {item.price * item.quantity}円
        </div>
      ))}

      <p>合計: {total}円</p>

      <hr />

      <h3>割り勘計算</h3>
      <button onClick={() => setPeople((prev) => (prev > 1 ? prev - 1 : 1))}>
        －
      </button>
      <span>{people}人</span>
      <button onClick={() => setPeople((prev) => prev + 1)}>＋</button>
      <p>1人あたり: {perPerson}円（切り上げ）</p>

      <button onClick={handleCheckout}>お支払い確定</button>

      <button onClick={() => navigate(`/c/${tableId}/menu`)}>
        メニューに戻る
      </button>
    </div>
  );
}
