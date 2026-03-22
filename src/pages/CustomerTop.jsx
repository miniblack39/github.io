//注文開始画面はここに
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { QR_codeSVG } from "qrcode.react";

export default function CustomerTop() {
  const navigate = useNavigate();
  const { tableId } = useParams();

  const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  const handleStart = async () => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    await setDoc(doc(db, "tables", tableId), {
      status: "occupied",
      sessionId: newSessionId,
      updatedAt: new Date(),
    });
    navigate(`/c/${newSessionId}/menu`);
  };

  return (
    <div>
      <h1>いらっしゃいませ！</h1>
      <p>座席番号：{tableId}番</p>
      <button onClick={handleStart}>注文を開始する</button>

      <hr />
      <button onClick={() => navigate("/staff/orders")}>
        開発用-staffページへ移動する
      </button>
    </div>
  );
}
