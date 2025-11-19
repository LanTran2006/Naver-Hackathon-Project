export async function uploadVideoAndGetLabel(file: Blob | File): Promise<string> {
  const formData = new FormData(); // Prepare upload payload.
  formData.append('file', file); // FastAPI expects parameter name "file".

  const baseUrl =
    import.meta.env.VITE_API_URL || 'http://localhost:8000'; // Allow overriding via env.
  console.log(file)
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/predict`, {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    console.error('Unable to reach backend:', error);
    throw new Error(
      'Cannot reach the sign-translation server. Please ensure the FastAPI backend is running (e.g., `uvicorn app.main:app --host 0.0.0.0 --port 8000`) and the network is not blocked.'
    );
  }

  if (!response.ok) {
    throw new Error(
      `Server responded with status ${response.status}. Please restart the backend and try again (details: ${response.statusText}).`
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
