export default function MessageComponent({ message, type }) {
  if (!message) return null; // Don't render anything if there's no message

  const messageClass = type === "success" ? "successMessage" : "errorMessage";

  return <div className={messageClass}>{message}</div>;
}
