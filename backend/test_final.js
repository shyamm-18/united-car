const apiKey = "AIzaSyAbFkAo5nlO2fbigr8zfWQzN-alrVHRPDo";

async function test() {
  console.log("Testing Gemini API...");
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Hi" }] }]
        })
      }
    );

    const data = await response.json();
    console.log("STATUS:", response.status);
    console.log("DATA:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("FETCH ERROR:", error);
  }
}

test();
