export async function uploadVideoAndGetLabel(file: Blob | File): Promise<string> {
  const formData = new FormData();
  
  // Determine filename based on file type
  let filename = 'recorded-video.webm'; // Default for Blob
  if (file instanceof File) {
    filename = file.name; // Use original filename for File uploads
  }
  
  // Ensure the blob has the correct MIME type
  let videoFile = file;
  if (file instanceof Blob && !file.type.includes('video')) {
    // If blob doesn't have proper type, create new one with video/webm
    videoFile = new Blob([file], { type: 'video/webm' });
  }
  
  formData.append('file', videoFile, filename);

  const baseUrl = import.meta.env.VITE_API_URL; // Fix spacing
  
  
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/predict`, {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type header manually - browser will set it with boundary
    });
  } catch (error) {
    console.error('Unable to reach backend:', error);
    throw new Error(
      'Cannot reach the sign-translation server. Please ensure the FastAPI backend is running (e.g., `uvicorn app.main:app --host 0.0.0.0 --port 8000`) and the network is not blocked.'
    );
  }
  console.log(response)
  if (!response.ok) {
    // Try to get more detailed error message from server
    let errorDetail = response.statusText;
    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch {
      // If can't parse JSON, use statusText
    }
    
    throw new Error(
      `Server responded with status ${response.status}: ${errorDetail}`
    );
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`Backend error: ${data.error}`);
  }

  if (!data.label) {
    throw new Error('Server did not return a valid predicted label.');
  }

  return data.label as string;
}

/**
 * Cắt video thành các đoạn 3 giây và gửi lần lượt cho server
 * @param videoBlob - Video blob cần cắt
 * @param onProgress - Callback để báo tiến độ (segment hiện tại, tổng segments, kết quả từng đoạn)
 * @returns Mảng các label từ server
 */
export async function uploadVideoInChunks(
  videoBlob: Blob,
  onProgress?: (current: number, total: number, label: string) => void
): Promise<string[]> {
  const CHUNK_DURATION = 3; // 3 giây mỗi đoạn
  
  // Tạo video element để đọc thời lượng
  const videoUrl = URL.createObjectURL(videoBlob);
  const videoElement = document.createElement('video');
  videoElement.src = videoUrl;
  
  // Đợi metadata load để lấy duration
  await new Promise<void>((resolve) => {
    videoElement.onloadedmetadata = () => resolve();
  });
  
  const totalDuration = videoElement.duration;
  const totalChunks = Math.ceil(totalDuration / CHUNK_DURATION);
  const labels: string[] = [];
  
  // Tạo MediaSource để cắt video
  for (let i = 0; i < totalChunks; i++) {
    const startTime = i * CHUNK_DURATION;
    const endTime = Math.min((i + 1) * CHUNK_DURATION, totalDuration);
    
    try {
      // Cắt video chunk
      const chunk = await extractVideoChunk(videoBlob, startTime, endTime);
      
      // Gửi chunk lên server
      const label = await uploadVideoAndGetLabel(chunk);
      labels.push(label);
      
      // Báo tiến độ
      if (onProgress) {
        onProgress(i + 1, totalChunks, label);
      }
    } catch (error) {
      console.error(`Error processing chunk ${i + 1}:`, error);
      labels.push('[error]');
    }
  }
  
  URL.revokeObjectURL(videoUrl);
  return labels;
}

/**
 * Cắt một đoạn video từ startTime đến endTime
 */
async function extractVideoChunk(
  videoBlob: Blob,
  startTime: number,
  endTime: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const videoUrl = URL.createObjectURL(videoBlob);
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Cannot get canvas context'));
      return;
    }
    
    video.src = videoUrl;
    video.muted = true;
    
    const chunks: Blob[] = [];
    let mediaRecorder: MediaRecorder;
    
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Tạo stream từ canvas
      const stream = canvas.captureStream(30);
      
      // Thêm audio track nếu có
      const audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(video);
      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);
      
      if (destination.stream.getAudioTracks().length > 0) {
        stream.addTrack(destination.stream.getAudioTracks()[0]);
      }
      
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: 1000000
      });
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        URL.revokeObjectURL(videoUrl);
        resolve(blob);
      };
      
      // Bắt đầu từ startTime
      video.currentTime = startTime;
    };
    
    video.onseeked = () => {
      mediaRecorder.start();
      video.play();
      
      // Render frames lên canvas
      const renderFrame = () => {
        if (video.currentTime >= endTime || video.ended) {
          mediaRecorder.stop();
          video.pause();
          return;
        }
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(renderFrame);
      };
      
      renderFrame();
    };
    
    video.onerror = () => {
      reject(new Error('Error loading video'));
      URL.revokeObjectURL(videoUrl);
    };
  });
}
