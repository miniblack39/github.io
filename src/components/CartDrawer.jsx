// カート
import Styles from "./CartDrawer.module.sass";

export default function CartDrawer({
  cartItems,
  setCartItems,
  setIsConfirmModalOpen,
}) {
  return (
    <div className={Styles.cartDrawer}>
      <div className={Styles.cartHeader}>
        <span>商品名</span>
        <span>数</span>
        <span>増</span>
        <span>減</span>
        <span>取消</span>
      </div>
      {cartItems.map((item) => (
        <div key={item.cartId} className={Styles.cartItem}>
          <span className={Styles.itemName}>
            {item.name}
            {item.subOption && (
              <span className={Styles.itemsub}>{item.subOption}</span>
            )}
          </span>
          <span className={Styles.qtyNum}>
            {item.quantity}
            {item.unit}
          </span>
          <button
            className={Styles.btnQty}
            onClick={() =>
              setCartItems((prev) =>
                prev.map((i) =>
                  i.cartId === item.cartId && i.quantity < 10
                    ? { ...i, quantity: i.quantity + 1 }
                    : i,
                ),
              )
            }
          >
            🔼
          </button>
          <button
            className={Styles.btnQty}
            onClick={() =>
              setCartItems((prev) =>
                prev.map((i) =>
                  i.cartId === item.cartId && i.quantity > 1
                    ? { ...i, quantity: i.quantity - 1 }
                    : i,
                ),
              )
            }
          >
            🔽
          </button>
          <button
            className={Styles.btnDelete}
            onClick={() =>
              setCartItems((prev) =>
                prev.filter((i) => i.cartId !== item.cartId),
              )
            }
          >
            ❌
          </button>
        </div>
      ))}

      <div className={Styles.cartFooter}>
        <button
          className={Styles.btnOrder}
          disabled={cartItems.length === 0}
          onClick={() => {
            setIsConfirmModalOpen(true);
          }}
        >
          注文へ進む
        </button>
      </div>
    </div>
  );
}
