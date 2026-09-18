/**
 * Extracts and normalizes an 11-character YouTube Video ID from raw ID strings or YouTube URLs.
 * Supported URL Formats:
 * - dQw4w9WgXcQ (raw 11-char ID)
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 */
export function extractYouTubeId(input: string): string | null {
  if (!input) return null;

  const trimmed = input.trim();

  // Raw 11-character alphanumeric/dash/underscore ID
  const RAW_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;
  if (RAW_ID_REGEX.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);

    // youtu.be/ID
    if (url.hostname === "youtu.be" || url.hostname === "www.youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      return RAW_ID_REGEX.test(id) ? id : null;
    }

    // youtube.com / www.youtube.com
    if (url.hostname.includes("youtube.com")) {
      // youtube.com/watch?v=ID
      if (url.searchParams.has("v")) {
        const id = url.searchParams.get("v");
        return id && RAW_ID_REGEX.test(id) ? id : null;
      }

      // youtube.com/embed/ID or youtube.com/v/ID
      const pathParts = url.pathname.split("/").filter(Boolean);
      if (pathParts.length >= 2 && (pathParts[0] === "embed" || pathParts[0] === "v")) {
        const id = pathParts[1];
        return RAW_ID_REGEX.test(id) ? id : null;
      }
    }
  } catch {
    // Return null if invalid URL
  }

  return null;
}
