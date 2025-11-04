function RecordingControls({ isPaused, onPause, onResume, onStop }) {
  return (
    <div>
      <button
        onClick={isPaused ? onResume : onPause}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-sm rounded cursor-pointer m-1.5"
      >
        {isPaused ? "Resume" : "Pause"}
      </button>

      <button
        onClick={onStop}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-sm rounded cursor-pointer m-1.5"
      >
        Stop
      </button>
    </div>
  );
}

export default RecordingControls;
