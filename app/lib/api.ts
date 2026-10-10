export async function callAiApi<T = any>(action: string, payload: any): Promise<T> {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });

  const rawText = await response.text();
  let data: any;

  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(
      response.status === 404
        ? "AI service is currently initializing. Please try again in a few moments."
        : `Server error (${response.status}): Unexpected response format.`
    );
  }

  if (!response.ok || data.error) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data.result as T;
}
