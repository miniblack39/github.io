// カート

import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";

export default function CartDrawer({
  cartItems,
  setCartItems,
  setIsConfirmModalOpen,
}) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  return (
    <div>
      {cartItems.map((item) => (
        <div key={item.cartId}>
          {item.name}
          {item.subOptions}
          {item.price}円{item.quantity}
          {item.unit}
          <button
            onClick={() =>
              setCartItems((prev) =>
                prev.map((i) =>
                  i.cartId === item.cartId
                    ? { ...i, quantity: i.quantity + 1 }
                    : i,
                ),
              )
            }
          >
            増やす
          </button>
          <button
            onClick={() => {
              if (item.quantity > 1) {
                setCartItems((prev) =>
                  prev.map((i) =>
                    i.cartId === item.cartId
                      ? { ...i, quantity: i.quantity - 1 }
                      : i,
                  ),
                );
              }
            }}
          >
            減らす
          </button>
          <button
            onClick={() => {
              setCartItems((prev) =>
                prev.filter((i) => i.cartId !== item.cartId),
              );
            }}
          >
            削除
          </button>
        </div>
      ))}
      <p>カート</p>

      <button
        onClick={() => {
          setIsConfirmModalOpen(true);
        }}
      >
        注文へ進む
      </button>

      {isOrderModalOpen && <div>注文しました！</div>}
    </div>
  );
}
