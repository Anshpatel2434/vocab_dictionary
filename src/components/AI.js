import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const talkWithAI = async (prompt) => {
	const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.0-flash",
			contents: prompt,
		});
		console.log("Got response from the AI and it is : ");
		console.log(response);
		return response;
	} catch (error) {
		console.error("Error:", error);
		alert("Error while generating response from genAI");
	}
};

export default talkWithAI;
