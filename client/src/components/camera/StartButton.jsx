function StartButton({ onStart }) {
  return (
    <button
      onClick={onStart}
      className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-base rounded cursor-pointer m-2.5"
    >
      Start Recording
    </button>
  );
}

export default StartButton;
