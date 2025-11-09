import React from "react";

const CameraPermissionCard = React.forwardRef(function CameraPermissionCard({prepareRecording,isPrepared}, videoRef) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-[95%] mx-auto min-h-[300px] md:min-h-[500px]">
      {/* Left main card */}
      <div className="flex flex-col items-center justify-center bg-green-50 rounded-2xl shadow-sm overflow-hidden relative min-h-[300px] md:min-h-[500px]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${!isPrepared ? 'hidden' : ''}`}
        />
        {!isPrepared && (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <p className="text-center text-gray-800 mb-4 text-sm md:text-base">
              Cấp quyền truy cập camera
              <br />
              để bắt đầu ghi hình
            </p>
            <button
              onClick={prepareRecording}
              className="bg-green-500 text-white px-4 md:px-6 py-2 rounded-full shadow hover:bg-green-600 transition text-sm md:text-base"
            >
              Cấp quyền
            </button>
          </div>
        )}
      </div>

      {/* Right side with two stacked boxes */}
      <div className="flex flex-col justify-between space-y-4 min-h-[300px] md:min-h-[500px]">
        <div className="bg-green-50 rounded-2xl h-1/2 shadow-sm" />
        <div className="bg-green-50 rounded-2xl h-1/2 shadow-sm" />
      </div>
    </div>
  );
});

export default CameraPermissionCard;
