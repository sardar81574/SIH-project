import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_KEY";
const genAI = new GoogleGenerativeAI(API_KEY);

export const askFarmerAssistant = async (chatHistory, userMessage) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "आप एक अनुभवी भारतीय कृषि वैज्ञानिक और किसान सलाहकार हैं। हमेशा सरल, स्पष्ट और व्यावहारिक हिंदी (देवनागरी) में चरणबद्ध तरीके से उत्तर दें।"
    });

    const chat = model.startChat({
      history: chatHistory.map(item => ({
        role: item.sender === "bot" ? "model" : "user",
        parts: [{ text: item.text }]
      }))
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "माफ़ कीजिए, सर्वर से संपर्क नहीं हो पाया। कृपया अपनी खाद, पानी और मौसम का विवरण दोबारा लिखें।";
  }
};