import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import WordInfo from "./WordInfo";
import HomeButton from "./HomeButton";
import { Wand2, Loader2, BookOpen, Send, FilePlus } from "lucide-react";
import talkWithAI from "./AI";

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
		const prompt = `You are Lexi, a world-renowned memory artist and narrative linguist. You believe that words are not just definitions; they are stories, feelings, and images waiting to be unlocked. Your singular talent is forging unforgettable mnemonics that are miniature works of art—clever, surprising, and deeply resonant. You reject the obvious and celebrate the ingenious.

Your task is to analyze the list of English words provided and, for each one, generate a single JSON object that strictly follows the "Lexi Method."

JSON Object Structure:
{
  "word": "<the word>",
  "pronunciation": "<phonetic IPA pronunciation> | <simple phonetic pronunciation, e.g., fuh·neh·tuhk>",
  "meaning": [
    { "meaning": "<first meaning (max 10 words)>", "example": "<clear example sentence using the word>" },
    { "meaning": "<second meaning if available>", "example": "<clear example sentence using the word>" }
  ],
  "origin": "<short, clear origin like 'Latin', 'Greek', with 1-sentence explanation>",
  "relate_with": "<a simple mental image, feeling, or situation to help remember this word>",
  "mnemonic": "<A high-impact, narrative-driven mnemonic that uses one of the Four Pillars.>",
  "breakdown": "<A simple, story-based explanation that directly clarifies how the 'mnemonic's story, object, or feeling' helps remember the word's meaning.>",
  "synonyms": ["<synonym1>", "<synonym2>", "<synonym3>"],
  "antonyms": ["<antonym1>", "<antonym2>", "<antonym3>"]
}

### CRITICAL INSTRUCTIONS: THE LEXI METHOD

**1. The Four Pillars of an Unforgettable Mnemonic (MANDATORY):**
You MUST build your mnemonic using one of these four advanced creative techniques. Do not use simple or obvious sound-alikes.

* **Pillar 1: The Metaphorical Object.** Find a specific object whose function *is* the word's meaning.
    * **Word:** Plummet
    * **Weak Mnemonic:** "A PLUM MET the ground." (Too simple.)
    * **LEXI METHOD:** \`A lead PLUMB-bob MET the floor instantly.\` (A plumb-bob's entire purpose is to drop straight and fast, making it the perfect metaphorical object.)

* **Pillar 2: The Micro-Narrative.** Tell a tiny story with emotion, conflict, or desire.
    * **Word:** Precipice
    * **Weak Mnemonic:** "PRESS A PIECE off." (Good, but we can do better.)
    * **LEXI METHOD:** \`A PRECIOUS diamond IS at the bottom.\` (This creates a story of temptation and danger, which perfectly captures the feeling of being on a precipice.)

* **Pillar 3: The Sensory Surprise.** Create a strange, specific, and memorable sensory image (taste, touch, sound).
    * **Word:** Salvage
    * **Weak Mnemonic:** "SAL'S GARAGE saves parts." (A bit cliché.)
    * **LEXI METHOD:** \`Use SALIVA to save the PAGE.\` (This is a weirdly specific, almost tactile image of a desperate act of rescue that is hard to forget.)

* **Pillar 4: The Logical Acronym.** The acronym must form a coherent sentence that logically explains the definition.
    * **Word:** Retroactively
    * **Weak Mnemonic:** "RETRO car ACTING new." (Okay, but not a story.)
    * **LEXI METHOD:** \`Review Every Transaction; Refunds Ordered ACTively.\` (This tells the entire procedural story of what retroactively means.)

**2. Breakdown Must Justify the Pillar:**
Your \`breakdown\` must clearly explain how your chosen mnemonic uses its Pillar to create meaning. For Pillar 1, explain the object. For Pillar 2, explain the story's emotion. For Pillar 3, explain the sensory link. For Pillar 4, explain the procedural story.

**3. Language & Tone:**
Maintain a simple, child-friendly tone throughout. Your creativity should be in the ideas, not complex vocabulary.

**4. Final Output Format:**
Return **ONLY a single, valid JSON array**. Do **NOT** include any introductory text or explanations. Your entire response must start with \`[\` and end with \`]\`.

Here is the list of words:
${wordsArray.join(", ")}`;

		try {
			setLoading(true);

			const response = await talkWithAI(prompt);

			const finalArray = cleanAndConvertJsonString(response);
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

	// NEW: Memoized calculation for word tokens
	const extractedWords = useMemo(() => {
		return wordsText
			.split(/,/)
			.map((w) => w.trim())
			.filter((w) => w.length > 0);
	}, [wordsText]);

	const handleAddWords = () => {
		if (extractedWords.length === 0) {
			toast.error("Please enter at least one word.");
			return;
		}
		run(extractedWords);
		// We can keep the text in the box until the results come back
	};

	return (
		<div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden">
			<Toaster
				position="top-center"
				toastOptions={{ style: { background: "#333", color: "#fff" } }}
			/>

			<div className="absolute top-0 left-0 p-4 z-10">
				<HomeButton />
			</div>

			{/* UPGRADED: Two-Panel Workbench Layout */}
			<div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-12 animate-fade-in">
					<h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl tracking-tight">
						AI <span className="text-cyan-400">Word Smith</span>
					</h1>
					<p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-400">
						Breathe life into new words. Enter vocabulary below, and our AI will
						forge detailed, memorable learning cards for you.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
					{/* --- LEFT PANEL: Input Zone --- */}
					<div className="lg:col-span-2">
						<div className="sticky top-24">
							<div className="bg-neutral-900 border border-neutral-700/50 rounded-2xl p-6 shadow-xl">
								<div className="flex items-center gap-3 mb-4">
									<FilePlus className="text-cyan-400" size={24} />
									<h2 className="text-xl font-bold text-white">
										Add Your Words
									</h2>
								</div>
								<p className="text-sm text-neutral-400 mb-3">
									Enter words separated by commas. The AI will process them into
									detailed learning cards.
								</p>
								<textarea
									rows={8}
									className="w-full px-4 py-3 bg-neutral-800/60 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-200"
									placeholder="e.g., ephemeral, loquacious, serendipity..."
									value={wordsText}
									onChange={(e) => setWordsText(e.target.value)}
								/>
								{/* NEW: Word Token Display */}
								<div className="mt-4">
									<h4 className="text-xs uppercase font-semibold text-neutral-500 mb-2">
										Detected Words ({extractedWords.length})
									</h4>
									<div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto rounded-lg bg-neutral-950/50 p-2">
										{extractedWords.length > 0 ? (
											extractedWords.map((word, index) => (
												<span
													key={index}
													className="px-2.5 py-1 bg-cyan-800/50 text-cyan-200 text-sm font-medium rounded-md"
												>
													{word}
												</span>
											))
										) : (
											<span className="text-sm text-neutral-600 italic px-2">
												Type to see words here...
											</span>
										)}
									</div>
								</div>

								<button
									onClick={handleAddWords}
									disabled={loading || extractedWords.length === 0}
									className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-cyan-500/20"
								>
									{loading ? (
										<>
											<Loader2 className="animate-spin" /> Processing...
										</>
									) : (
										<>
											<Send size={18} /> Process {extractedWords.length}{" "}
											{extractedWords.length === 1 ? "Word" : "Words"}
										</>
									)}
								</button>
							</div>
						</div>
					</div>

					{/* --- RIGHT PANEL: Results Stage --- */}
					<div className="lg:col-span-3">
						<div className="flex items-center gap-3 mb-4">
							<BookOpen className="text-cyan-400" size={24} />
							<h2 className="text-xl font-bold text-white">
								Generated Results
							</h2>
						</div>
						<div className="space-y-4">
							{loading ? (
								// UPGRADED: Skeleton Loader while processing
								<>
									<WordInfoSkeleton />
									<WordInfoSkeleton />
									<WordInfoSkeleton />
								</>
							) : currentAddedWords.length > 0 ? (
								// Displaying results using the trusted WordInfo component
								currentAddedWords.map((item, index) => (
									<WordInfo key={index} wordInfo={item} />
								))
							) : (
								// Initial empty state
								<div className="text-center py-20 border-2 border-dashed border-neutral-800 rounded-2xl">
									<Wand2 size={48} className="mx-auto text-neutral-700 mb-4" />
									<h3 className="text-xl font-medium text-neutral-400">
										Your results will appear here.
									</h3>
									<p className="mt-2 text-neutral-500">
										Enter words on the left to get started.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// We can reuse the skeleton loader from the Dictionary page for consistency
const WordInfoSkeleton = () => (
	<div className="w-full mb-3 bg-neutral-900 rounded-2xl border border-neutral-800 p-5 shadow-md animate-pulse">
		<div className="flex justify-between items-center">
			<div className="flex items-center gap-4">
				<div className="h-7 w-32 bg-neutral-700 rounded-md"></div>
				<div className="h-5 w-48 bg-neutral-700 rounded-md"></div>
			</div>
			<div className="h-6 w-6 bg-neutral-700 rounded-md"></div>
		</div>
	</div>
);

export default AddWordsPage;
