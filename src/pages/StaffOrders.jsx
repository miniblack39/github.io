//staff用画面
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  query,
  orderBy,
} from "firebase/firestore";

export default function StaffOrders() {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [showUnservedOnly, setShowUnservedOnly] = useState(false);
  const [selectedTable, setSelectedTable] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tables"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTables(data);
    });
    return () => unsubscribe();
  }, []);

  const handleItemServed = async (orderId, itemIndex) => {
    const order = orders.find((o) => o.id === orderId);
    const updatedItems = order.items.map((item, index) =>
      index === itemIndex ? { ...item, isServed: true } : item,
    );
    await updateDoc(doc(db, "orders", orderId), {
      items: updatedItems,
    });
  };

  const handleBussing = async (tableId) => {
    await setDoc(doc(db, "tables", tableId), {
      status: "ready",
      updatedAt: new Date(),
    });
  };

  const isFinished = (tableId) => {
    const table = tables.find((t) => t.id === tableId);
    return table?.status === "finished";
  };

  const tableIds = ["all", ...tables.map((table) => table.id)];

  const displayOrders = orders
    .filter(
      (order) => selectedTable === "all" || order.tableId === selectedTable,
    )
    .filter(
      (order) =>
        !showUnservedOnly || order.items.some((item) => !item.isServed),
    );

  return (
    <div>
      <button onClick={() => navigate("/c/1")}>開発用-お客様TOPへ戻る</button>
      <button onClick={() => navigate("/c/1/menu")}>開発用-menu画面へ</button>
      <button onClick={() => navigate("/staff/orders")}>
        開発用-STAFF画面へ
      </button>
      <hr />
      <h2>注文一覧</h2>

      <div>
        {tableIds.map((tableId) => (
          <button key={tableId} onClick={() => setSelectedTable(tableId)}>
            {tableId === "all" ? "全テーブル" : `テーブル${tableId}`}
          </button>
        ))}
      </div>

      <button onClick={() => setShowUnservedOnly(!showUnservedOnly)}>
        {showUnservedOnly ? "全て表示" : "未提供のみ表示"}
      </button>

      {selectedTable !== "all" && isFinished(selectedTable) && (
        <button onClick={() => handleBussing(selectedTable)}>
          バッシング完了（テーブル{selectedTable}）
        </button>
      )}

      {displayOrders.map((order) => (
        <div key={order.id}>
          <p>テーブル: {order.tableId}</p>
          <p>
            注文時間: {order.createdAt?.toDate().toLocaleTimeString("ja-JP")}
          </p>
          {order.items.map((item, index) => (
            <div key={index}>
              {item.name}
              {item.subOptions && ` (${item.subOptions})`}×{item.quantity}
              {item.unit}
              {item.isServed ? (
                <span> ✅ 提供済み</span>
              ) : (
                <button onClick={() => handleItemServed(order.id, index)}>
                  提供済みにする
                </button>
              )}
            </div>
          ))}
          <hr />
        </div>
      ))}
    </div>
  );
}
