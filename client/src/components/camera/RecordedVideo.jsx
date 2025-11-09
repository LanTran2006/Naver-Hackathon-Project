function RecordedVideo({ recordedUrl, onRecordAgain, onTranslate, isLoading }) {
  return (
    <div className="mt-5 px-3">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Video đã ghi</h2>
      <video
        src={recordedUrl}
        controls
        className="w-full max-w-[640px] rounded-lg mb-5 mx-auto"
      />
      <div className="flex flex-col sm:flex-row justify-center gap-2 flex-wrap">
        <button
          onClick={onRecordAgain}
          className="bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm rounded cursor-pointer w-full sm:w-auto"
        >
          Ghi lại
        </button>
        <a
          href={recordedUrl}
          download="recording.webm"
          className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm rounded cursor-pointer no-underline text-center w-full sm:w-auto"
        >
          Tải xuống
        </a>
        <button
          onClick={onTranslate}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm rounded cursor-pointer disabled:bg-green-300 w-full sm:w-auto"
        >
          {isLoading ? "Đang dịch..." : "Dịch video"}
        </button>
      </div>
    </div>
  );
}

export default RecordedVideo;
