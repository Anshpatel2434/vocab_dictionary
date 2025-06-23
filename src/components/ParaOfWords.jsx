import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import talkWithAI from "./AI";
import WordPopup from "./WordPopup"; // Make sure to import the updated component

const ParaOfWords = ({
	allWords,
	isSessionActive,
	onWordClick,
	clickedWords = new Set(),
}) => {
	const [generateParagraph, setGenerateParagraph] = useState(false);
	const [generatedContent, setGeneratedContent] = useState("");
	const [loading, setLoading] = useState(false);
	const [selectedWords, setSelectedWords] = useState([]);
	const [contentType, setContentType] = useState("paragraph");
	const [showContent, setShowContent] = useState(false);

	useEffect(() => {
		if (generateParagraph && allWords.length > 0) {
			handleGenerate();
		}
	}, [generateParagraph]);

	const [showPopup, setShowPopup] = useState(false);
	const [selectedWordForPopup, setSelectedWordForPopup] = useState(null);

	const closePopup = () => {
		setShowPopup(false);
		setSelectedWordForPopup(null);
	};

	// Transform word objects into AI-optimized format
	const transformWordsForAI = (words) => {
		return words.map((wordObj) => ({
			word: wordObj.word,
			pronunciation: wordObj.pronunciation,
			meaning: wordObj.meaning[0]?.meaning || "No meaning available",
			example: wordObj.meaning[0]?.example || "No example available",
			synonyms: wordObj.synonyms || [],
			antonyms: wordObj.antonyms || [],
			difficulty:
				wordObj.no_of_times_opened === 0
					? "challenging"
					: wordObj.no_of_times_opened <= 2
					? "intermediate"
					: "familiar",
			context_hint: wordObj.relate_with || "",
			origin: wordObj.origin || "",
		}));
	};

	// Prioritize words based on usage frequency and difficulty
	const prioritizeWords = (transformedWords) => {
		return transformedWords.sort((a, b) => {
			// Prioritize less opened words first
			const aOpened =
				allWords.find((w) => w.word === a.word)?.no_of_times_opened || 0;
			const bOpened =
				allWords.find((w) => w.word === b.word)?.no_of_times_opened || 0;

			if (aOpened !== bOpened) {
				return aOpened - bOpened; // Less opened words first
			}

			// Secondary sort by word length (longer words might be more complex)
			return b.word.length - a.word.length;
		});
	};

	const createOptimizedPrompt = (wordData, type) => {
		// Group words by difficulty for better AI understanding
		const challengingWords = wordData.filter(
			(w) => w.difficulty === "challenging"
		);
		const intermediateWords = wordData.filter(
			(w) => w.difficulty === "intermediate"
		);
		const familiarWords = wordData.filter((w) => w.difficulty === "familiar");

		// Create detailed word information for AI
		const wordDetails = wordData
			.map(
				(w) =>
					`"${w.word}" (${w.pronunciation}) - ${w.meaning}. Example: ${
						w.example
					}. Synonyms: ${w.synonyms.join(", ")}${
						w.context_hint ? `. Context: ${w.context_hint}` : ""
					}`
			)
			.join("\n");

		const prompts = {
			paragraph: `Create a coherent, engaging paragraph (200-250 words) using ALL of these vocabulary words naturally and meaningfully. Each word must be used exactly once in its proper context.

VOCABULARY WORDS TO USE:
${wordDetails}

REQUIREMENTS:
- Use every single word from the list above
- Make the paragraph flow naturally and be engaging to read
- Ensure each word is used in its correct context based on the provided meaning
- Bold each vocabulary word when you use it (wrap in **word**)
- Choose a theme that allows natural incorporation of all words
- Prioritize challenging words (${challengingWords
				.map((w) => w.word)
				.join(", ")}) by using them in prominent positions
- Make the content educational and memorable

The paragraph should read naturally while demonstrating the proper usage of each vocabulary word.`,

			story: `Write a creative short story (300-400 words) that incorporates ALL of these vocabulary words naturally within the narrative. Each word must be used exactly once.

VOCABULARY WORDS TO USE:
${wordDetails}

REQUIREMENTS:
- Use every single word from the list above
- Create an engaging plot with characters
- Ensure each word fits naturally into the story context
- Bold each vocabulary word when you use it (wrap in **word**)
- Make the story memorable and entertaining
- Focus on using challenging words (${challengingWords
				.map((w) => w.word)
				.join(", ")}) in key story moments
- Ensure the story flows naturally despite incorporating all words

Create a compelling narrative that serves as an effective vocabulary learning tool.`,

			essay: `Write a structured mini-essay (350-450 words) on a relevant topic that naturally incorporates ALL of these vocabulary words. Each word must be used exactly once.

VOCABULARY WORDS TO USE:
${wordDetails}

REQUIREMENTS:
- Use every single word from the list above
- Structure with clear introduction, body paragraphs, and conclusion
- Ensure each word is used meaningfully and contributes to the argument
- Bold each vocabulary word when you use it (wrap in **word**)
- Choose a topic that allows natural use of all provided words
- Use challenging words (${challengingWords
				.map((w) => w.word)
				.join(", ")}) in strong argumentative positions
- Maintain academic tone while being engaging
- Ensure logical flow and coherent argument structure

The essay should demonstrate sophisticated vocabulary usage while maintaining clarity and persuasiveness.`,
		};
		return prompts[type] || prompts.paragraph;
	};

	async function handleGenerate() {
		if (allWords.length === 0) {
			toast.error("No words available to generate content");
			setGenerateParagraph(false);
			return;
		}

		try {
			setLoading(true);

			// Transform and prioritize ALL words
			const transformedWords = transformWordsForAI(allWords);
			const prioritizedWords = prioritizeWords(transformedWords);

			// For very large word lists, we might need to chunk them
			// But let's try to use all words first
			const maxWords = Math.min(prioritizedWords.length, 50); // Limit to 50 words to avoid token limits
			const wordsToUse = prioritizedWords.slice(0, maxWords);

			setSelectedWords(wordsToUse.map((w) => w.word));

			const prompt = createOptimizedPrompt(wordsToUse, contentType);

			console.log("Generated prompt:", prompt); // For debugging

			const response = await talkWithAI(prompt);

			if (response && response.text) {
				setGeneratedContent(response.text);
				setShowContent(true);
				toast.success(
					`${
						contentType.charAt(0).toUpperCase() + contentType.slice(1)
					} generated using ${wordsToUse.length} words!`
				);
			} else {
				throw new Error("No content received");
			}
		} catch (error) {
			console.error("Error generating content:", error);
			toast.error("Failed to generate content. Please try again.");
		} finally {
			setLoading(false);
			setGenerateParagraph(false);
		}
	}

	const handleTypeChange = (type) => {
		setContentType(type);
		setShowContent(false);
		setGeneratedContent("");
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(generatedContent);
		toast.success("Content copied to clipboard!");
	};

	// Get word statistics
	const getWordStats = () => {
		const challenging = allWords.filter(
			(w) => w.no_of_times_opened >= 5
		).length;
		const intermediate = allWords.filter(
			(w) => w.no_of_times_opened < 5 && w.no_of_times_opened > 1
		).length;
		const familiar = allWords.filter((w) => w.no_of_times_opened <= 1).length;

		return { challenging, intermediate, familiar, total: allWords.length };
	};

	// Enhanced word click handler for session mode
	const handleWordClickInContent = (event, word) => {
		if (!isSessionActive) return;

		// Find the word object from allWords
		const wordObj = allWords.find(
			(w) => w.word.toLowerCase() === word.toLowerCase()
		);

		if (wordObj && onWordClick) {
			onWordClick(wordObj);

			// Show popup with the full word object and click position
			setSelectedWordForPopup({
				...wordObj, // Pass the complete word object
				clickPosition: {
					x: event.clientX,
					y: event.clientY,
				},
			});
			setShowPopup(true);
		}
	};

	// Enhanced content rendering with clickable words during session
	const renderContentWithClickableWords = (content) => {
		if (!isSessionActive) {
			return content.replace(
				/\*\*(.*?)\*\*/g,
				'<strong class="text-purple-400">$1</strong>'
			);
		}

		return content.replace(/\*\*(.*?)\*\*/g, (match, word) => {
			const wordObj = allWords.find(
				(w) => w.word.toLowerCase() === word.toLowerCase()
			);
			const isClicked = wordObj && clickedWords.has(wordObj._id);

			return `<span 
				class="vocabulary-word cursor-pointer font-semibold px-1.5 py-0.5 mx-0.5 rounded-md transition-colors duration-200 ${
					isClicked
						? "text-blue-200 bg-blue-700/10 border border-blue-500/30"
						: "text-yellow-100 bg-yellow-700/10 border border-yellow-500/20 hover:bg-yellow-600/10"
				}"
				data-word="${word}"
				onclick="handleVocabWordClick(event, '${word}')"
			>${word}</span>`;
		});
	};

	// Add click handler to window for vocabulary words
	useEffect(() => {
		if (isSessionActive) {
			window.handleVocabWordClick = (event, word) => {
				handleWordClickInContent(event, word);
			};
		}

		return () => {
			if (window.handleVocabWordClick) {
				delete window.handleVocabWordClick;
			}
		};
	}, [isSessionActive, allWords, onWordClick]);

	if (allWords.length === 0) {
		return null;
	}

	const stats = getWordStats();

	return (
		<div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 relative">
			{/* Word Popup - Updated to use the correct prop structure */}
			{showPopup && selectedWordForPopup && (
				<WordPopup
					word={selectedWordForPopup}
					onClose={closePopup}
					position={selectedWordForPopup.clickPosition}
				/>
			)}
			<div
				className={`bg-gray-900 rounded-lg border border-gray-700 p-6 transition-all duration-500 ${
					isSessionActive
						? "ring-2 ring-blue-500 shadow-2xl shadow-blue-500/20"
						: ""
				}`}
			>
				{/* Header */}
				<div
					className={`flex flex-col md:flex-row md:items-center md:justify-between mb-6 transition-opacity duration-300 ${
						isSessionActive && !showContent ? "opacity-30" : "opacity-100"
					}`}
				>
					<div className="mb-4 md:mb-0">
						<h2 className="text-2xl font-bold text-white mb-2">
							<span className="text-purple-400">AI</span> Content Generator
							{isSessionActive && (
								<span className="ml-3 text-sm bg-green-600 text-white px-3 py-1 rounded-full">
									Session Active
								</span>
							)}
						</h2>
						<p className="text-gray-400">
							{isSessionActive
								? "Click on highlighted words in the generated content to view details"
								: "Generate engaging content using ALL words from your dictionary"}
						</p>
						<div className="mt-2 text-sm text-gray-500">
							Dictionary: {stats.total} words ({stats.challenging} challenging,{" "}
							{stats.intermediate} intermediate, {stats.familiar} familiar)
							{isSessionActive && clickedWords.size > 0 && (
								<span className="ml-3 text-green-400">
									• {clickedWords.size} words explored
								</span>
							)}
						</div>
					</div>

					{/* Content Type Selector - Hidden during session */}
					{!isSessionActive && (
						<div className="flex gap-2">
							{["paragraph", "story", "essay"].map((type) => (
								<button
									key={type}
									onClick={() => handleTypeChange(type)}
									disabled={contentType === type}
									className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
										contentType === type
											? "bg-purple-600 text-white"
											: "bg-gray-800 text-gray-300 hover:bg-gray-700"
									}`}
								>
									{type.charAt(0).toUpperCase() + type.slice(1)}
								</button>
							))}
						</div>
					)}
				</div>

				{/* Generate Button - Hidden during session unless no content */}
				{(!isSessionActive || !showContent) && (
					<div
						className={`flex justify-center mb-6 transition-opacity duration-300 ${
							isSessionActive && showContent ? "opacity-30" : "opacity-100"
						}`}
					>
						<button
							onClick={() => setGenerateParagraph(true)}
							disabled={loading || allWords.length === 0}
							className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
						>
							{loading ? (
								<>
									<svg
										className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
									Generating...
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
											d="M13 10V3L4 14h7v7l9-11h-7z"
										></path>
									</svg>
									Generate{" "}
									{contentType.charAt(0).toUpperCase() + contentType.slice(1)}
									<span className="text-purple-200 ml-1">
										({Math.min(stats.total, 50)} words)
									</span>
								</>
							)}
						</button>
					</div>
				)}

				{/* Selected Words Display - Dimmed during session */}
				{selectedWords.length > 0 && (
					<div
						className={`mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600 transition-opacity duration-300 ${
							isSessionActive ? "opacity-40" : "opacity-100"
						}`}
					>
						<h3 className="text-lg font-semibold text-white mb-3">
							Words Used in Generation ({selectedWords.length}):
						</h3>
						<div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
							{selectedWords.map((word, index) => (
								<span
									key={index}
									className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full"
								>
									{word}
								</span>
							))}
						</div>
					</div>
				)}

				{/* Generated Content - Enhanced for session mode */}
				{showContent && generatedContent && (
					<div
						className={`bg-gray-800 rounded-lg border border-gray-600 p-6 transition-all duration-500 ${
							isSessionActive
								? "ring-2 ring-yellow-500 shadow-xl shadow-yellow-500/20"
								: ""
						}`}
					>
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-xl font-semibold text-white">
								Generated{" "}
								{contentType.charAt(0).toUpperCase() + contentType.slice(1)}
								{isSessionActive && (
									<span className="ml-3 text-sm bg-yellow-600 text-white px-2 py-1 rounded">
										Interactive Mode
									</span>
								)}
							</h3>
							<button
								onClick={copyToClipboard}
								className={`flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-all duration-200 ${
									isSessionActive ? "opacity-50" : "opacity-100"
								}`}
								disabled={isSessionActive}
							>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
									></path>
								</svg>
								Copy
							</button>
						</div>
						{/* Session Instructions */}
						{isSessionActive && (
							<div className="mb-4 p-4 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-400/30 rounded-xl backdrop-blur-sm">
								<div className="flex items-center gap-3 text-blue-300">
									<div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
									<span className="font-semibold text-white">
										Interactive Learning Mode
									</span>
								</div>
								<p className="text-blue-200 text-sm mt-2 leading-relaxed">
									Tap any highlighted word to discover its meaning,
									pronunciation, and examples.
									<span className="inline-block ml-1 px-2 py-0.5 bg-blue-600/30 rounded text-xs">
										Explored words turn blue
									</span>
								</p>
							</div>
						)}
						<div className="prose prose-gray max-w-none">
							<div
								className="text-gray-300 leading-relaxed whitespace-pre-wrap"
								dangerouslySetInnerHTML={{
									__html: renderContentWithClickableWords(generatedContent),
								}}
							/>
						</div>
						{/* Session Progress */}
						// Updated Session Progress styling:
						{isSessionActive && (
							<div className="mt-6 p-4 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-400/30 rounded-xl">
								<div className="flex justify-between items-center text-emerald-300 mb-3">
									<span className="font-semibold flex items-center gap-2">
										<span className="text-lg">📊</span>
										Learning Progress
									</span>
									<span className="text-emerald-100 font-mono">
										{clickedWords.size} / {selectedWords.length}
									</span>
								</div>
								<div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
									<div
										className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 ease-out shadow-lg shadow-emerald-500/30"
										style={{
											width: `${
												(clickedWords.size / selectedWords.length) * 100
											}%`,
										}}
									></div>
								</div>
								<p className="text-emerald-200 text-xs mt-2 text-center">
									{clickedWords.size === selectedWords.length
										? "🎉 Amazing! You've explored all words!"
										: `${
												selectedWords.length - clickedWords.size
										  } words left to explore`}
								</p>
							</div>
						)}
					</div>
				)}

				{/* Enhanced Info Section - Dimmed during session */}
				<div
					className={`mt-6 p-4 bg-gray-800 rounded-lg border border-gray-600 transition-opacity duration-300 ${
						isSessionActive ? "opacity-40" : "opacity-100"
					}`}
				>
					<div className="flex items-start gap-3">
						<svg
							className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<div className="text-sm text-gray-400">
							<p className="mb-2">
								<strong className="text-gray-300">
									Enhanced AI Processing:
								</strong>
								Uses ALL words from your dictionary with detailed context
								including meanings, examples, synonyms, and difficulty levels
								for optimal content generation.
							</p>
							<p className="mb-2">
								<strong className="text-gray-300">Smart Prioritization:</strong>
								Prioritizes challenging and less-viewed words to maximize
								learning potential.
							</p>
							<p>
								<strong className="text-gray-300">
									{isSessionActive
										? "Interactive Learning:"
										: "Vocabulary Mastery:"}
								</strong>
								{isSessionActive
									? " Click highlighted words to explore meanings and track your progress through the vocabulary."
									: " Bold words in generated content make it easy to identify and learn vocabulary in context."}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ParaOfWords;
