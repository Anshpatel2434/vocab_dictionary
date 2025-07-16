import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import WordInfo from "./WordInfo";
import { useNavigate } from "react-router-dom";
import talkWithAI from "./AI";
import HomeButton from "./HomeButton";

const AddWordsPage = () => {
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	const navigate = useNavigate();

	const [wordsText, setWordsText] = useState("");
	const [loading, setLoading] = useState(false);
	const [currentAddedWords, setCurrentAddedWords] = useState([]);

	useEffect(() => {
		verifyLogin();
	}, []);

	async function verifyLogin() {
		try {
			const res = await axios.post(`${BACKEND_URL}/api/v1/verifyPassword`, {
				password: localStorage.getItem("vocabToken"),
			});

			if (res.status === 200) {
			} else {
				toast.error(res.data.message);
				navigate("/");
			}
		} catch (error) {
			console.log("In error of the sendRequest in security : ", error);
			toast.error(error.response?.data?.message || "Authentication failed");
			navigate("/");
		}
	}

	const run = async (wordsArray) => {
		const prompt = `You are an expert English language assistant.

I will give you a list of English words.

For each word, return a JSON object with these exact fields:
{
  "word": "<the word>",
  "pronunciation": "<phonetic IPA pronunciation> | <simple phonetic pronunciation, e.g., uhn·taylz>",
  "meaning": [
    { "meaning": "<first meaning (max 10 words)>", "example": "<clear example sentence using the word>" },
    { "meaning": "<second meaning if available>", "example": "<clear example sentence using the word>" }
  ],
  "origin": "<short, clear origin like 'Latin', 'Greek', with 1-sentence explanation>",
  "relate_with": "<a simple mental image, feeling, or situation to help remember this word>",
  "mnemonic": "<a super short, clever, and highly memorable phrase or sound-alike trick that directly hints at the word's meaning. It should be instantly recalled and directly connect to what the word means. Prioritize creative acronyms or vivid sound-alikes that make the meaning 'click'. Avoid simple, technical splits like 'PRE + JUDGE'. For example: 'Ubiquitous: U B Quick To See It Everywhere.' (means found everywhere). 'Ephemeral: Every Photo Eventually Melts Away, Really A Little.' (means short-lived). 'Cacophony: Cats And Cows Often Fight, Oh No! Yikes!' (means loud, messy noise).>",
  "breakdown": "<a simple, vivid, story-based, or visual explanation that directly clarifies how the 'mnemonic' helps remember the word's meaning. Explain the connection between the mnemonic's parts and the word's definition. For example: 'For Ubiquitous (U B Quick To See It Everywhere): This mnemonic uses the sound of 'U B Quick' to remind you of 'ubiquitous' and then tells you that something 'everywhere' is quick to see, linking the sound to the meaning.' 'For Ephemeral (Every Photo Eventually Melts Away, Really A Little): This mnemonic starts with 'Every Photo' (EP) to sound like 'ephemeral' and then uses the idea of photos 'melting away' quickly to show it means lasting only a very short time.' 'For Cacophony (Cats And Cows Often Fight, Oh No! Yikes!): This mnemonic uses the first sounds 'Ca-Co' to remind you of 'cacophony' and then paints a picture of fighting cats and cows, making a very loud, messy noise.'>",
  "synonyms": ["<synonym1>", "<synonym2>", "<synonym3>"],
  "antonyms": ["<antonym1>", "<antonym2>", "<antonym3>"]
}

Important instructions:
✅ Always give at least one meaning & example.
✅ If there are multiple common meanings, provide them (up to 2).
✅ Use **clear, simple, child-friendly English** throughout.
✅ For "mnemonic", prioritize:
  - **Creative, meaning-rich acronyms or phrases** using the letters.
  - **Sound-alike tricks** that directly hint at the meaning.
  - The mnemonic must be **instantly helpful for recall** and not just a mechanical split or addition. It should make the meaning 'click'.
  - Make it instantly memorable and intuitive for recall, avoiding complex or technical breakdowns.
  - Ensure it directly reflects the meaning with a vivid image or action.
✅ For "breakdown", give a **visual, story-based, or situation-based memory hook** in plain English. This must directly explain how the *mnemonic* helps remember the word's meaning.
✅ For "pronunciation", provide both the **IPA** and a **simple, easy-to-read phonetic spelling** (using standard English letters and dots for syllables).
✅ Use common, simple English words for synonyms and antonyms if available.
✅ Return **only** a **valid JSON array** with no extra explanation.

Here is the list of words:
${wordsArray.join(", ")}`;

		try {
			setLoading(true);

			const response = await talkWithAI(prompt);

			const finalArray = cleanAndConvertJsonString(response.text);
			console.log(finalArray);
			setCurrentAddedWords(finalArray);
			await postWords(finalArray);

			setLoading(false);
		} catch (error) {
			console.error("Error:", error);
			toast.error("Failed to generate word information");
			setLoading(false);
		}
	};

	async function postWords(words) {
		try {
			const res = await axios.post(`${BACKEND_URL}/api/v1/postWords`, {
				words: words,
			});
			if (res.status === 201) {
				toast.success(res.data.message);
				// Update with the response data if needed
			}
		} catch (error) {
			console.log("Error while posting words: ", error);
			toast.error(error.response?.data?.message || "Failed to save words");
		}
	}

	function cleanAndConvertJsonString(jsonString) {
		try {
			// Remove triple backticks and 'json' marker
			const cleanedString = jsonString
				.trim()
				.replace(/^```json\s*/i, "") // remove ```json at start
				.replace(/```$/i, "") // remove ``` at end
				.trim();

			const parsed = JSON.parse(cleanedString);

			if (Array.isArray(parsed)) {
				console.log("✅ Successfully converted to array of objects!");
				return parsed;
			} else {
				console.error("⚠ Parsed JSON is not an array.");
				return [];
			}
		} catch (error) {
			console.error("❌ Failed to parse JSON string:", error.message);
			return [];
		}
	}

	function extractWords(wordsText) {
		const rawWords = wordsText.includes(",")
			? wordsText.split(",")
			: [wordsText];

		const cleanedWords = rawWords
			.map((w) => w.trim()) // remove spaces
			.filter((w) => w.length > 0); // ignore blanks

		return cleanedWords;
	}

	function handleAddWords() {
		if (!wordsText.trim()) {
			toast.error("Please enter at least one word");
			return;
		}

		const wordsArray = extractWords(wordsText);
		if (wordsArray.length === 0) {
			toast.error("Please enter valid words");
			return;
		}

		run(wordsArray);
		setWordsText("");
	}

	return (
		<div className="min-h-screen bg-gray-950 text-white">
			<Toaster
				position="top-center"
				toastOptions={{
					duration: 3000,
					style: {
						background: "#333",
						color: "#fff",
						borderRadius: "10px",
					},
				}}
			/>

			{/* Header Section */}
			<div className="bg-black shadow-md shadow-blue-900/20">
				<HomeButton />
				<div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between">
						<div className="mb-4 md:mb-0">
							<h1 className="text-3xl font-bold text-white">
								<span className="text-blue-400">Add</span> Words
							</h1>
							<p className="mt-1 text-gray-400">
								Grow your personal dictionary with new words
							</p>
						</div>

						{/* Navigation Button */}
						<div className="w-full md:w-auto">
							<a
								href="/dictionary/1"
								className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 w-full md:w-auto"
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									></path>
								</svg>
								Go to Dictionary
							</a>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
				<div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6 mb-8">
					<h2 className="text-xl font-semibold text-blue-400 mb-4">
						Add New Words
					</h2>

					<div className="mb-4">
						<p className="text-gray-300 mb-2">
							Add your words separated by single comma only (example:
							perseverance, eloquent, ephemeral)
						</p>
						<textarea
							rows={6}
							className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
							placeholder="Enter words here, separated by commas..."
							value={wordsText}
							onChange={(event) => {
								setWordsText(event.target.value);
							}}
						/>
					</div>

					<div className="flex justify-end">
						<button
							onClick={handleAddWords}
							disabled={loading}
							className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? (
								<>
									<svg
										className="animate-spin h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Processing...
								</>
							) : (
								<>
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M12 6v6m0 0v6m0-6h6m-6 0H6"
										></path>
									</svg>
									Add Words
								</>
							)}
						</button>
					</div>
				</div>

				{/* Added Words Section */}
				{currentAddedWords.length > 0 && (
					<div className="mt-8">
						<h2 className="text-2xl font-bold text-white mb-6 flex items-center">
							<span className="text-blue-400 mr-2">Added</span> Words
							<span className="ml-3 text-sm bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full">
								{currentAddedWords.length}{" "}
								{currentAddedWords.length === 1 ? "word" : "words"}
							</span>
						</h2>

						<div className="space-y-4">
							{currentAddedWords.map((item, index) => (
								<WordInfo key={index} wordInfo={item} />
							))}
						</div>
					</div>
				)}

				{/* Loading State */}
				{loading && currentAddedWords.length === 0 && (
					<div className="flex justify-center items-center h-64">
						<div className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-black shadow-sm">
							<svg
								className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-400"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Generating word information...
						</div>
					</div>
				)}

				{/* Empty State */}
				{!loading && currentAddedWords.length === 0 && (
					<div className="text-center py-16 bg-gray-900/50 rounded-lg border border-gray-800">
						<div className="text-5xl mb-4 text-gray-600">📚</div>
						<h3 className="text-xl font-medium text-gray-300">
							No words added yet
						</h3>
						<p className="mt-2 text-gray-500 max-w-md mx-auto">
							Enter words separated by commas in the text area above and click
							"Add Words" to start building your dictionary.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default AddWordsPage;
