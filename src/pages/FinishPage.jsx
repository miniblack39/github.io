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
    <div>
      <h2>ありがとうございました!</h2>
      <p>またのご来店をお待ちしております。</p>
      <button onClick={() => navigate(`/c/${tableId}`)}>
        開発用-トップに戻る
      </button>
      <button onClick={() => navigate("/staff/orders")}>
        開発用-スタッフ画面へ
      </button>
    </div>
  );
}
