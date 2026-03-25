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
import Styles from "./StaffOrders.module.sass";

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
    <div className={Styles.container}>
      <div className={Styles.header}>
        <button className={Styles.btnNav} onClick={() => navigate("/c/1")}>
          開発用-お客様TOPへ戻る
        </button>
        <button className={Styles.btnNav} onClick={() => navigate("/c/1/menu")}>
          開発用-menu画面へ
        </button>
        <button
          className={Styles.btnNav}
          onClick={() => navigate("/staff/orders")}
        >
          開発用-STAFF画面へ
        </button>
      </div>
      <hr />
      <h2 className={Styles.title}>注文一覧</h2>

      <div className={Styles.tableTabs}>
        {tableIds.map((tableId) => (
          <button
            key={tableId}
            className={
              selectedTable === tableId ? Styles.tabActive : Styles.tab
            }
            onClick={() => setSelectedTable(tableId)}
          >
            {tableId === "all"
              ? "全テーブル"
              : `テーブル${tables.find((t) => t.id === tableId)?.name || tableId}`}
          </button>
        ))}
      </div>

      <button
        className={Styles.btnToggle}
        onClick={() => setShowUnservedOnly(!showUnservedOnly)}
      >
        {showUnservedOnly ? "全て表示" : "未提供のみ表示"}
      </button>

      {selectedTable !== "all" && isFinished(selectedTable) && (
        <button
          className={Styles.btnBussing}
          onClick={() => handleBussing(selectedTable)}
        >
          バッシング完了（テーブル
          {tables.find((t) => t.id === selectedTable)?.name || selectedTable}）
        </button>
      )}
      <div className={Styles.orderGrid}>
        {displayOrders.map((order) => (
          <div key={order.id} className={Styles.orderCard}>
            <div className={Styles.orderHeader}>
              <span className={Styles.tableLabel}>
                テーブル:{" "}
                {tables.find((t) => t.id === order.tableId)?.name ||
                  order.tableId}
              </span>
              <span className={Styles.orderTime}>
                注文時間:{" "}
                {(() => {
                  if (!order.createdAt) return "不明";
                  const date = order.createdAt.toDate
                    ? order.createdAt.toDate()
                    : order.createdAt;
                  return date.toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });
                })()}
              </span>
            </div>
            {order.items.map((item, index) => (
              <div key={index} className={Styles.itemRow}>
                <div className={Styles.itemInfo}>
                  <span className={Styles.itemName}>{item.name}</span>
                  {item.subOptions && (
                    <span className={Styles.itemSub}>({item.subOptions})</span>
                  )}
                  <span className={Styles.itemQty}>
                    × {item.quantity}
                    {item.unit}
                  </span>
                </div>
                {item.isServed ? (
                  <span className={Styles.servedBadge}>済</span>
                ) : (
                  <button
                    className={Styles.btnServe}
                    onClick={() => handleItemServed(order.id, index)}
                  >
                    提供
                  </button>
                )}
              </div>
            ))}
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}
