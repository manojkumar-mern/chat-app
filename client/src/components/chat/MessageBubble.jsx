import styles from "./MessageBubble.module.css";

export default function MessageBubble({
  id,
  text,
  isMine,
  time,
  status,
  onDelete,
}) {
  const getTicks = () => {
    if (!isMine) return null;

    if (status === "seen") return "✔✔";
    if (status === "delivered") return "✔✔";
    return "✔";
  };

  return (
    <div className={`${styles.wrapper} ${isMine ? styles.right : styles.left}`}>
      <div className={styles.bubble}>
        <p>{text}</p>

        <span className={styles.meta}>
          {new Date(time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}

          {isMine && <span className={styles.ticks}>{getTicks()}</span>}

          {/* DELETE BTN */}
          {isMine && (
            <span className={styles.deleteBtn} onClick={() => onDelete(id)}>
              🗑
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
