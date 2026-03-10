//注文開始画面はここに
import { useNavigate, useParams } from "react-router-dom";
import Styles from "./CustomerTop.module.sass";

export default function CustomerTop() {
  const navigate = useNavigate();
  const { tableId } = useParams();

  return (
    <div>
      <h1>いらっしゃいませ！</h1>
      <p>座席番号：{tableId}番</p>
      <button onClick={() => navigate(`/c/${tableId}/menu`)}>
        注文を開始する
      </button>
    </div>
  );
}
