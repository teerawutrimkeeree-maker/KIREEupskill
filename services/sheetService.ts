const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbwJoOOd9RvmsPlckai_wEfv9gADnXDo8AedFbiwf4Nk2TLOGkvViMjC54r__4OOJFzGFQ/exec"; // ← ใส่ URL ที่ได้จากขั้นตอน 3

export async function saveToSheet(data: any) {
  const res = await fetch(SHEET_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getSheetData(className: string) {
  const res = await fetch(`${SHEET_API_URL}?class=${encodeURIComponent(className)}`);
  return res.json();
}
