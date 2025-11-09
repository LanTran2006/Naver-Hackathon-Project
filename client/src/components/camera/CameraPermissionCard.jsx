import React from "react";

const CameraPermissionCard = React.forwardRef(function CameraPermissionCard({prepareRecording,isPrepared}, videoRef) {

  return (
    <div className="grid grid-cols-2 gap-4 w-[95%] mx-auto min-h-[500px]">
      {/* Left main card */}
      <div className="flex flex-col items-center justify-center bg-green-50 rounded-2xl shadow-sm overflow-hidden relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${!isPrepared ? 'hidden' : ''}`}
        />
        {!isPrepared && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-center text-gray-800 mb-4">
              Cấp quyền truy cập camera
              <br />
              để bắt đầu ghi hình
            </p>
            <button
              onClick={prepareRecording}
              className="bg-green-500 text-white px-6 py-2 rounded-full shadow hover:bg-green-600 transition"
            >
              Cấp quyền
            </button>
          </div>
        )}
      </div>

      {/* Right side with two stacked boxes */}
      <div className="flex flex-col justify-between space-y-4">
        <div className="bg-green-50 rounded-2xl h-1/2 shadow-sm" />
        <div className="bg-green-50 rounded-2xl h-1/2 shadow-sm" />
      </div>
    </div>
  );
});

export default CameraPermissionCard;
