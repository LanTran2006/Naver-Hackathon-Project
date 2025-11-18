/**
 * Cắt video blob thành các đoạn nhỏ theo thời gian
 * @param {Blob} videoBlob - Video blob cần cắt
 * @param {number} segmentDuration - Độ dài mỗi đoạn (giây), mặc định 3s
 * @returns {Promise<Blob[]>} - Mảng các video blob đã cắt
 */
export async function splitVideoIntoSegments(videoBlob, segmentDuration = 3) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    video.preload = "metadata";
    video.src = URL.createObjectURL(videoBlob);

    video.onloadedmetadata = async () => {
      const duration = video.duration;
      const segments = [];
      const numberOfSegments = Math.ceil(duration / segmentDuration);

      console.log(
        `Video duration: ${duration}s, will split into ${numberOfSegments} segments`
      );

      try {
        for (let i = 0; i < numberOfSegments; i++) {
          const startTime = i * segmentDuration;
          const endTime = Math.min((i + 1) * segmentDuration, duration);

          const segmentBlob = await extractSegment(
            videoBlob,
            startTime,
            endTime
          );

          segments.push(segmentBlob);
        }

        URL.revokeObjectURL(video.src);
        resolve(segments);
      } catch (error) {
        URL.revokeObjectURL(video.src);
        reject(error);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error("Cannot load video metadata"));
    };
  });
}

/**
 * Trích xuất một đoạn video từ startTime đến endTime
 */
async function extractSegment(videoBlob, startTime, endTime) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(videoBlob);
    video.preload = "auto";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    let mediaRecorder;
    let chunks = [];
    let stream;

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.currentTime = startTime;
    };

    video.onseeked = () => {
      // Tắt âm thanh khi xử lý
      video.muted = true;
      video.volume = 0;

      // Tạo stream từ canvas
      stream = canvas.captureStream(30); // 30 FPS

      // Thêm audio track nếu có
      const audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(video);
      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);
      // KHÔNG connect vào audioContext.destination để tránh phát âm thanh
      // source.connect(audioContext.destination);

      // Merge video và audio streams
      const tracks = [
        ...stream.getVideoTracks(),
        ...destination.stream.getAudioTracks(),
      ];
      const mergedStream = new MediaStream(tracks);

      mediaRecorder = new MediaRecorder(mergedStream, {
        mimeType: "video/webm;codecs=vp9",
      });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        URL.revokeObjectURL(video.src);
        audioContext.close();
        resolve(blob);
      };

      mediaRecorder.start();
      video.play();

      // Render frames to canvas
      const renderFrame = () => {
        if (video.currentTime < endTime && !video.paused && !video.ended) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          requestAnimationFrame(renderFrame);
        } else {
          video.pause();
          mediaRecorder.stop();
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      renderFrame();
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error("Video playback error"));
    };
  });
}

/**
 * Cách đơn giản hơn: Chỉ cắt metadata (không re-encode)
 * Sử dụng khi cần tốc độ nhanh hơn
 */
export async function splitVideoSimple(videoBlob, segmentDuration = 3) {
  const arrayBuffer = await videoBlob.arrayBuffer();
  const duration = await getVideoDuration(videoBlob);
  const numberOfSegments = Math.ceil(duration / segmentDuration);

  // Ước tính kích thước mỗi segment
  const segmentSize = Math.floor(arrayBuffer.byteLength / numberOfSegments);
  const segments = [];

  for (let i = 0; i < numberOfSegments; i++) {
    const start = i * segmentSize;
    const end = Math.min((i + 1) * segmentSize, arrayBuffer.byteLength);
    const segmentData = arrayBuffer.slice(start, end);
    segments.push(new Blob([segmentData], { type: videoBlob.type }));
  }

  return segments;
}

/**
 * Lấy thời lượng video
 */
function getVideoDuration(videoBlob) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(videoBlob);

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error("Cannot load video"));
    };
  });
}
