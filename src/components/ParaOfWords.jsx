// ParaOfWords.jsx
import React, { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import talkWithAI from "./AI";
import WordPopup from "./WordPopup";
import WordCard_Popup from "./WordCard_Popup"; // NEW
import {
	Sparkles,
	Loader2,
	Copy,
	FileText,
	Book,
	PenSquare,
} from "lucide-react";

// --- Main Component ---
const ParaOfWords = ({
	allWords,
	isSessionActive,
	onWordClick,
	clickedWords = new Set(),
}) => {
	// --- State Management (Mostly Unchanged) ---
	const [generatedContent, setGeneratedContent] = useState("");
	const [loading, setLoading] = useState(false);
	const [selectedWordsForAI, setSelectedWordsForAI] = useState([]);
	const [contentType, setContentType] = useState("story");
	const [showContent, setShowContent] = useState(false);
	const [showPopup, setShowPopup] = useState(false);
	const [selectedWordForPopup, setSelectedWordForPopup] = useState(null);

	// --- Upgraded AI Prompt Engineering ---

	const { wordsForAI, wordStats } = useMemo(() => {
		if (!allWords || allWords.length === 0) {
			return {
				wordsForAI: [],
				wordStats: { challenging: 0, intermediate: 0, familiar: 0 },
			};
		}

		const transformed = allWords.map((wordObj) => {
			const opened = wordObj.no_of_times_opened || 0;
			let difficulty;
			if (opened === 0) difficulty = "challenging";
			else if (opened <= 2) difficulty = "intermediate";
			else difficulty = "familiar";

			return {
				word: wordObj.word,
				meaning: wordObj.meaning[0]?.meaning || "not available",
				example: wordObj.meaning[0]?.example || "not available",
				difficulty: difficulty,
			};
		});

		const sorted = [...transformed].sort((a, b) => {
			const difficultyOrder = { challenging: 0, intermediate: 1, familiar: 2 };
			return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
		});

		const stats = {
			challenging: transformed.filter((w) => w.difficulty === "challenging")
				.length,
			intermediate: transformed.filter((w) => w.difficulty === "intermediate")
				.length,
			familiar: transformed.filter((w) => w.difficulty === "familiar").length,
		};

		return { wordsForAI: sorted, wordStats: stats };
	}, [allWords]);

	// --- THIS IS THE NEW, UPGRADED PROMPT FUNCTION ---
	const createOptimizedPrompt = (wordData, type) => {
		const wordListMarkdown = wordData
			.map(
				(w) =>
					`- **${w.word}**: (${w.difficulty}) ${w.meaning}. Must be used in a context that reflects this meaning.`
			)
			.join("\n");

		const personaPrompts = {
			story:
				"You are a master storyteller and vocabulary expert. Your task is to write a captivating short story.",
			paragraph:
				"You are a skilled essayist and linguist. Your task is to write a coherent and insightful paragraph on a compelling theme.",
			essay:
				"You are a professional academic writer and editor. Your task is to construct a persuasive mini-essay with a clear thesis.",
		};

		const basePrompt = `
        ${personaPrompts[type]}

        Your primary goal is to seamlessly weave the following vocabulary words into your writing. Each word must be used exactly once. The integration must feel natural and intelligent, not forced.

        **Vocabulary List:**
        ${wordListMarkdown}

        **Core Requirements:**
        1.  **Natural Integration:** The words must feel like a natural part of the narrative or argument, not a vocabulary list.
        2.  **Contextual Accuracy:** Each word's usage must perfectly match its provided meaning.
        3.  **Thematic Cohesion:** Create a single, unifying theme (for a story, this means a plot; for an essay, a central thesis) that logically connects all the words.
        4.  **Highlighting:** You MUST bold every vocabulary word from the list by wrapping it in double asterisks, like **this**.
        5.  **Word Count:** Adhere to a word count of approximately 250-350 words.

        **AVOID:**
        -   Creating sentences that are simple definitions of the words.
        -   A narrative or argument that feels disjointed or forced.
        -   Using any word more than once.

        Begin writing now.
        `;
		return basePrompt;
	};

	async function handleGenerate() {
		if (wordsForAI.length === 0) return toast.error("No words available.");

		setLoading(true);
		setShowContent(false);
		setGeneratedContent("");

		try {
			const wordsToUse = wordsForAI.slice(0, 50); // Use up to 50 prioritized words
			setSelectedWordsForAI(wordsToUse);

			const prompt = createOptimizedPrompt(wordsToUse, contentType);
			const response = await talkWithAI(prompt);

			if (response) {
				setGeneratedContent(response);
				setShowContent(true);
				toast.success(`Generated a new ${contentType}!`);
			} else {
				throw new Error("AI did not return content.");
			}
		} catch (error) {
			toast.error("AI content generation failed.");
			console.error("Error generating content:", error);
		} finally {
			setLoading(false);
		}
	}

	// --- Event Handlers & Content Rendering (with minor updates) ---
	const handleTypeChange = (type) => {
		setContentType(type);
	};
	const copyToClipboard = () => {
		navigator.clipboard.writeText(generatedContent);
		toast.success("Content copied to clipboard!");
	};
	const closePopup = () => {
		setShowPopup(false);

		setSelectedWordForPopup(null);
	};

	useEffect(() => {
		if (isSessionActive) {
			window.handleVocabWordClick = (event, word) => {
				const wordObj = allWords.find(
					(w) => w.word.toLowerCase() === word.toLowerCase()
				);
				if (wordObj && onWordClick) {
					onWordClick(wordObj);
					setSelectedWordForPopup({
						...wordObj,
						clickPosition: { x: event.clientX, y: event.clientY },
					});
					setShowPopup(true);
				}
			};
		}
		return () => {
			if (window.handleVocabWordClick) delete window.handleVocabWordClick;
		};
	}, [isSessionActive, allWords, onWordClick]);

	const renderContentWithClickableWords = (content) => {
		if (!isSessionActive) {
			return content.replace(
				/\*\*(.*?)\*\*/g,
				'<strong class="text-cyan-300 font-semibold">$1</strong>'
			);
		}
		return content.replace(/\*\*(.*?)\*\*/g, (match, word) => {
			const wordObj = allWords.find(
				(w) => w.word.toLowerCase() === word.toLowerCase()
			);
			const isClicked = wordObj && clickedWords.has(wordObj._id);
			return `<span class="vocabulary-word cursor-pointer font-semibold px-1.5 py-0.5 mx-0.5 rounded-md transition-all duration-200 ${
				isClicked
					? "bg-blue-800 text-white ring-1 ring-blue-500"
					: "bg-yellow-800/50 text-yellow-200 hover:bg-yellow-700/50"
			}" data-word="${word}" onclick="handleVocabWordClick(event, '${word}')">${word}</span>`;
		});
	};

	if (allWords.length === 0) return null;

	return (
		<div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
			{showPopup && (
				<WordPopup
					word={selectedWordForPopup}
					onClose={closePopup}
					position={selectedWordForPopup.clickPosition}
				/>
			)}

			{/* UPGRADED Main Container with Glassmorphism Effect */}
			<div className="relative bg-neutral-900/50 border border-neutral-700/50 rounded-2xl shadow-2xl shadow-black/30 backdrop-blur-xl p-6">
				<div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none"></div>

				{/* --- Control Panel --- */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pb-6 border-b border-neutral-700/80">
					<div className="md:col-span-1">
						<h2 className="text-xl font-bold text-white flex items-center gap-3">
							<Sparkles className="text-purple-400" /> AI Content Studio
						</h2>
						<p className="text-sm text-neutral-400 mt-1">
							Generate dynamic content from your word list.
						</p>
					</div>

					<div className="flex justify-center items-center bg-neutral-800/50 p-1.5 rounded-full border border-neutral-700">
						{["story", "paragraph", "essay"].map((type) => (
							<button
								key={type}
								onClick={() => handleTypeChange(type)}
								className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
									contentType === type
										? "bg-purple-600 text-white shadow-md"
										: "text-neutral-300 hover:bg-neutral-700/50"
								}`}
							>
								{type === "story" && <Book size={16} />}
								{type === "paragraph" && <FileText size={16} />}
								{type === "essay" && <PenSquare size={16} />}
								{type.charAt(0).toUpperCase() + type.slice(1)}
							</button>
						))}
					</div>

					<div className="flex justify-end">
						<button
							onClick={handleGenerate}
							disabled={loading}
							className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-opacity duration-200"
						>
							{loading ? (
								<>
									<Loader2 className="animate-spin" /> Generating...
								</>
							) : (
								<>
									<Sparkles size={18} /> Generate {contentType}
								</>
							)}
						</button>
					</div>
				</div>

				{/* --- Word Stats & Session Indicator --- */}
				<div className="flex justify-between items-center py-4">
					<div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral-400">
						<span>
							<strong className="text-red-400">{wordStats.challenging}</strong>{" "}
							Challenging
						</span>
						<span>
							<strong className="text-yellow-400">
								{wordStats.intermediate}
							</strong>{" "}
							Intermediate
						</span>
						<span>
							<strong className="text-green-400">{wordStats.familiar}</strong>{" "}
							Familiar
						</span>
					</div>
					{isSessionActive && (
						<div className="flex items-center gap-2 text-sm font-semibold text-cyan-300 bg-cyan-900/50 px-3 py-1.5 rounded-full">
							<div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
							Interactive Session is LIVE
						</div>
					)}
				</div>

				{/* --- Content Stage --- */}
				{loading && (
					<div className="w-full min-h-[300px] bg-neutral-800/50 rounded-xl p-6 animate-pulse">
						<div className="h-4 bg-neutral-700 rounded w-3/4 mb-4"></div>
						<div className="h-4 bg-neutral-700 rounded w-full mb-2"></div>
						<div className="h-4 bg-neutral-700 rounded w-full mb-2"></div>
						<div className="h-4 bg-neutral-700 rounded w-5/6"></div>
					</div>
				)}
				{showContent && generatedContent && (
					<div
						className={`min-h-[300px] bg-neutral-800/30 rounded-xl p-6 border transition-all duration-500 ${
							isSessionActive
								? "border-cyan-500/50 ring-2 ring-cyan-500/20"
								: "border-neutral-700"
						}`}
					>
						<div
							className="prose prose-invert prose-p:text-neutral-300 prose-strong:text-cyan-300 max-w-none leading-relaxed whitespace-pre-wrap"
							dangerouslySetInnerHTML={{
								__html: renderContentWithClickableWords(generatedContent),
							}}
						/>
						{isSessionActive && (
							<div className="mt-6 border-t border-neutral-700 pt-4">
								<div className="w-full bg-neutral-700 rounded-full h-3 overflow-hidden">
									<div
										className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
										style={{
											width: `${
												(clickedWords.size / selectedWordsForAI.length) * 100
											}%`,
										}}
									></div>
								</div>
								<p className="text-center text-xs text-neutral-400 mt-2">
									Progress: {clickedWords.size} / {selectedWordsForAI.length}{" "}
									words explored
								</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ParaOfWords;
