const apiKey = "AIzaSyAbFkAo5nlO2fbigr8zfWQzN-alrVHRPDo";

async function listModels() {
  console.log("Listing available models for this key...");
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    const data = await response.json();
    console.log("STATUS:", response.status);
    if (data.models) {
        console.log("AVAILABLE MODELS:", data.models.map(m => m.name).join(', '));
    } else {
        console.log("NO MODELS FOUND. ERROR:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("FETCH ERROR:", error);
  }
}

listModels();
