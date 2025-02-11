const API_BASE_URL = "http://localhost:3001/api/upload";

/**
 * Uploads a video file to server.
 * @param file - the video file to upload
 * @returns The uploaded video URL or error message
 */

export const uploadVideo = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("video", file);

  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Errrpr uploading video:", error);
    throw error;
  }
};

/**
 * Fetched the list of uploaded video URLs.
 * @returns Array of video URLs
 */
export const fetchVideos = async (): Promise<{ url: string }[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/list`);

    if (!response.ok) {
      throw new Error(`Failed to fetch videos: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
};
