export async function uploadVideoAndGetLabel(file: Blob | File): Promise<string> {
  const formData = new FormData();
  
  // Determine filename based on file type
  let filename = 'video.webm'; // Default for Blob
  if (file instanceof File) {
    filename = file.name; // Use original filename for File uploads
  }
  
  formData.append('file', file, filename);

  const baseUrl = import.meta.env.VITE_API_URL; // Fix spacing
  console.log('Uploading file:', filename, 'Size:', file.size, 'Type:', file.type);
  
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