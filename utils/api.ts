const BASE_URL = "http://192.168.0.6:8000";

export async function addEntryAPI(entry: { date: string; diary: string; mood: string }) {
  try {
    const response = await fetch(`${BASE_URL}/add_entry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    return await response.json();
  } catch (err) {
    console.error("Error adding entry:", err);
    throw err;
  }
}
