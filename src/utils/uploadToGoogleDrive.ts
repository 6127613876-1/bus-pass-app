// src/utils/uploadToGoogleDrive.ts

export async function uploadToGoogleDrive(file: File): Promise<string> {
  // Convert file to base64
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix
      const base64String = result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Send to backend server
  const response = await fetch('https://server.tceapps.in/api/upload/google-drive', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      fileData: base64,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.url) {
    throw new Error(data.error || 'Google Drive upload failed');
  }

  return data.url; // Direct download link
}