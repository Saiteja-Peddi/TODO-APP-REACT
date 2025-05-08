export default function Counter() {
  function onIncrementClick() {
    console.log("Increment button clicked");
  }

  return (
    <div className="Counter">
      <span className="count">0</span>
      <div className="buttons">
        <button className="increment" onClick={onIncrementClick}>
          Increment
        </button>
      </div>
    </div>
  );
}
