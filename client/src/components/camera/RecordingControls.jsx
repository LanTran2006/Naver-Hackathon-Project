function RecordingControls({ isPaused, onPause, onResume, onStop }) {
  return (
    <div>
      <button
        onClick={isPaused ? onResume : onPause}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-sm rounded-full cursor-pointer m-1.5"
      >
        {isPaused ? "Tiếp tục" : "Tạm dừng"}
      </button>

      <button
        onClick={onStop}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-sm rounded-full cursor-pointer m-1.5"
      >
        Dừng
      </button>
    </div>
  );
}

export default RecordingControls;
