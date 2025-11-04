function RecordedVideo({ recordedUrl, onRecordAgain }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Recorded Video</h2>
      <video
        src={recordedUrl}
        controls
        className="w-full max-w-[640px] rounded-lg mb-5 mx-auto"
      />
      <div>
        <button
          onClick={onRecordAgain}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-sm rounded cursor-pointer m-1.5"
        >
          Record Again
        </button>
        <a
          href={recordedUrl}
          download="recording.webm"
          className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-sm rounded cursor-pointer m-1.5 no-underline"
        >
          Download
        </a>
      </div>
    </div>
  );
}

export default RecordedVideo;
