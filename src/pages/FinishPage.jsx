//完了画面
import { useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

export default function FinishPage() {
  const { tableId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "tables", tableId), (snapshot) => {
      const data = snapshot.data();
      if (data?.status === "ready") {
        navigate(`/c/${tableId}`);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>ありがとうございました！</h2>
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
