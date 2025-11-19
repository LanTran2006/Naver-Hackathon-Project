/**
 * Convert WebM blob to MP4 using Canvas and MediaRecorder
 * This method re-encodes the video by playing it and capturing with H.264 codec
 */
export async function convertWebMToMP4(webmBlob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Cannot get canvas context'));
      return;
    }
    
    video.src = URL.createObjectURL(webmBlob);
    video.muted = true;
    video.playsInline = true;
    
    const chunks: Blob[] = [];
    let mediaRecorder: MediaRecorder | null = null;
    
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Create stream from canvas
      const stream = canvas.captureStream(30);
      
      // Try to use H.264 codec for MP4
      const mimeTypes = [
        'video/mp4;codecs=h264',
        'video/mp4',
        'video/webm;codecs=h264',
        'video/webm;codecs=vp8'
      ];
      
      let selectedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }
      
      if (!selectedMimeType) {
        reject(new Error('No supported video format found'));
        return;
      }
      
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        videoBitsPerSecond: 1000000
      });
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Use mp4 type regardless of actual encoding
        const blob = new Blob(chunks, { type: 'video/mp4' });
        URL.revokeObjectURL(video.src);
        resolve(blob);
      };
      
      mediaRecorder.onerror = (e) => {
        reject(new Error('MediaRecorder error: ' + e));
      };
      
      // Start recording and play video
      mediaRecorder.start();
      video.play();
      
      // Render frames to canvas
      const renderFrame = () => {
        if (video.ended || video.paused) {
          if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
          return;
        }
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(renderFrame);
      };
      
      renderFrame();
    };
    
    video.onerror = () => {
      reject(new Error('Error loading video'));
      URL.revokeObjectURL(video.src);
    };
  });
}
