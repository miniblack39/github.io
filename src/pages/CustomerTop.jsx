//注文開始画面はここに
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { QRCodeSVG } from "qrcode.react";
import Styles from "./CustomerTop.module.sass";

export default function CustomerTop() {
  const navigate = useNavigate();
  const { tableId } = useParams();

  const handleStart = async () => {
    const newSessionId = Math.random().toString(36).substring(2, 10);
    await setDoc(
      doc(db, "tables", tableId),
      {
        status: "occupied",
        sessionId: newSessionId,
        updatedAt: new Date(),
      },
      { merge: true },
    );
    navigate(`/c/${newSessionId}/menu`);
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.card}>
        <h1 className={Styles.welcomeText}>いらっしゃいませ！</h1>

        <div className={Styles.tableCircle}>
          <span className={Styles.tableLabel}>座席番号</span>
          <span className={Styles.tableNumber}>{tableId}</span>
        </div>

        <button className={Styles.btnStart} onClick={handleStart}>
          注文を開始する
        </button>

        <button
          className={Styles.btnStaff}
          onClick={() => navigate("/staff/orders")}
        >
          デモ用-店舗用管理画面へ
        </button>
      </div>
    </div>
  );
}
