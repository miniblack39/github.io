//staff用画面
import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";

export default function StaffOrders() {
  const [orders, setOrders] = useState([]);
  const [showUnservedOnly, setShowUnservedOnly] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    });
    return () => unsubscribe();
  }, []);

  const handleServed = async (orderId) => {
    await updateDoc(doc(db, "orders", orderId), {
      isServed: true,
    });
  };

  const displayOrders = showUnservedOnly
    ? orders.filter((order) => !order.isServed)
    : orders;

  return (
    <div>
      <h2>注文一覧</h2>
      <button onClick={() => setShowUnservedOnly(!showUnservedOnly)}>
        {showUnservedOnly ? "全て表示" : "未提供のみ表示"}
      </button>

      {displayOrders.map((order) => (
        <div key={order.id}>
          <p>テーブル: {order.tableId}</p>
          <p>
            注文時間: {order.createdAt?.toDate().toLocaleTimeString("ja-JP")}
          </p>
          {order.items.map((item, index) => (
            <div key={index}>
              {item.name}
              {item.subOptions && ` (${item.subOptions})`}
            </div>
          ))}
          {order.isServed ? (
            <p>提供済み</p>
          ) : (
            <button onClick={() => handleServed(order.id)}>
              提供済みにする
            </button>
          )}
          <hr />
        </div>
      ))}
    </div>
  );
}
