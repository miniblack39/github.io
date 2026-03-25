//完了画面
import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import Styles from "./FinishPage.module.sass";

export default function FinishPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [tableId, setTableId] = useState(null);

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
    if (!tableId) return;
    const unsubscribe = onSnapshot(doc(db, "tables", tableId), (snapshot) => {
      const data = snapshot.data();
      if (data?.status === "ready") {
        navigate(`/c/${tableId}`);
      }
    });
    return () => unsubscribe();
  }, [tableId]);

  return (
    <div className={Styles.container}>
      <div className={Styles.card}>
        <div className={Styles.iconArea}></div>
        <h2 className={Styles.title}>ありがとうございました！</h2>
        <p className={Styles.message}>
          またのご来店を、スタッフ一同
          <br />
          心よりお待ちしております。
        </p>
      </div>

      <div className={Styles.devSection}>
        <span className={Styles.devTitle}>開発用ショートカット</span>
        <button
          className={Styles.btnDev}
          onClick={() => navigate(`/c/${tableId}`)}
        >
          トップに戻る
        </button>
        <button
          className={Styles.btnDev}
          onClick={() => navigate("/staff/orders")}
        >
          スタッフ画面へ
        </button>
      </div>
    </div>
  );
}
