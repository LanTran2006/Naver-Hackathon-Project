function StartButton({ onStart, disabled }) {
  return (
    <button
      onClick={onStart}
      disabled={disabled}
      className={`px-4 md:px-8 py-3 md:py-4 text-sm md:text-base rounded-full cursor-pointer ${
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
