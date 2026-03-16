//注文開始画面はここに
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function CustomerTop() {
  const navigate = useNavigate();
  const { tableId } = useParams();

  const handleStart = async () => {
    await setDoc(doc(db, "tables", tableId), {
      status: "occupied",
      updatedAt: new Date(),
    });
    navigate(`/c/${tableId}/menu`);
  };

  return (
    <div>
      <h1>いらっしゃいませ！</h1>
      <p>座席番号：{tableId}番</p>
      <button onClick={handleStart}>注文を開始する</button>
    </div>
  );
}
