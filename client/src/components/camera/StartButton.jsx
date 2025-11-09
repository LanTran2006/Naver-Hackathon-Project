function StartButton({ onStart, disabled }) {
  return (
    <button
      onClick={onStart}
      disabled={disabled}
      className={`px-8 py-4 text-base rounded-full cursor-pointer m-2.5 ${
        disabled 
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
          : 'bg-green-500 hover:bg-green-600 text-white'
      }`}
    >
      Bắt đầu ghi hình
    </button>
  );
}

export default StartButton;
