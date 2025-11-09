function RecordingControls({ isPaused, onPause, onResume, onStop }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <button
        onClick={isPaused ? onResume : onPause}
        className="bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm rounded-full cursor-pointer"
      >
        {isPaused ? "Tiếp tục" : "Tạm dừng"}
      </button>

      <button
        onClick={onStop}
        className="bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm rounded-full cursor-pointer"
      >
        Dừng
      </button>
    </div>
  );
}

export default RecordingControls;
