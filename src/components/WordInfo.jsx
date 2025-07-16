import axios from "axios";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const WordInfo = ({ wordInfo }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [openCount, setOpenCount] = useState(wordInfo.no_of_times_opened || 0);
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	const toggleExpand = () => {
		const wasExpanded = isExpanded;
		setIsExpanded(!isExpanded);
		if (!wasExpanded) {
			increaseCount();
		}
	};

	// async function increaseCount() {
	// 	try {
	// 		const res = await axios.post(
	// 			`${BACKEND_URL}/api/v1/increase_open_count`,
	// 			{ id: wordInfo._id }
	// 		);
	// 		if (res.status === 200) {
	// 			setOpenCount((prev) => prev + 1);
	// 		}
	// 	} catch (error) {
	// 		console.error("Error increasing count:", error);
	// 	}
	// }

	// Highlight matching parts in mnemonic
	const highlightMnemonic = (mnemonic, word) => {
		const wordUpper = word.toUpperCase();
		const parts = [];
		let wordIndex = 0;
		let lastIndex = 0;

		for (let i = 0; i < mnemonic.length; i++) {
			const mnemonicChar = mnemonic[i].toUpperCase();
			if (
				wordIndex < wordUpper.length &&
				mnemonicChar === wordUpper[wordIndex]
			) {
				// Push preceding non-highlighted text
				if (lastIndex < i) {
					parts.push(
						<span key={`text-${lastIndex}`}>
							{mnemonic.slice(lastIndex, i)}
						</span>
					);
				}
				// Push highlighted letter
				parts.push(
					<span key={`highlight-${i}`} className="font-bold text-yellow-400">
						{mnemonic[i]}
					</span>
				);
				wordIndex++;
				lastIndex = i + 1;
			}
		}
		// Push remaining text
		if (lastIndex < mnemonic.length) {
			parts.push(<span key={`text-end`}>{mnemonic.slice(lastIndex)}</span>);
		}

		return parts;
	};

	return (
		<div className="w-full mb-3 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl border border-neutral-700 shadow-md hover:shadow-xl transition-all duration-300">
			<button
				onClick={toggleExpand}
				className="w-full flex justify-between items-center px-5 py-3 text-left focus:outline-none hover:bg-neutral-700/50 rounded-t-2xl transition-colors duration-200"
			>
				<div className="flex items-center gap-4">
					<h2 className="text-xl font-bold text-white tracking-tight">
						{wordInfo.word}
					</h2>
					{wordInfo.pronunciation && (
						<span className="text-sm text-blue-300 font-medium">
							{wordInfo.pronunciation}
						</span>
					)}
					<span className="text-xs text-green-300 bg-green-900/30 px-2.5 py-1 rounded-full font-semibold">
						{openCount}
					</span>
				</div>
				{isExpanded ? (
					<ChevronUp className="text-blue-400 w-6 h-6 transition-transform duration-300" />
				) : (
					<ChevronDown className="text-blue-400 w-6 h-6 transition-transform duration-300" />
				)}
			</button>

			<div
				className={`overflow-hidden transition-all duration-500 ease-in-out ${
					isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className="px-5 pb-4 text-gray-200 text-sm space-y-5">
					{/* Meanings */}
					{wordInfo?.meaning?.length > 0 && (
						<section>
							<h3 className="text-blue-400 font-semibold text-base mb-2">
								Meaning & Examples
							</h3>
							{wordInfo.meaning.map((item, index) => (
								<div
									key={index}
									className="border-l-2 border-blue-600 pl-4 mt-1.5"
								>
									<p className="text-yellow-300 font-medium">{item.meaning}</p>
									{item.example && (
										<p className="italic text-yellow-200/80 mt-1">
											"{item.example}"
										</p>
									)}
								</div>
							))}
						</section>
					)}

					{/* Origin */}
					{wordInfo.origin && (
						<section>
							<h3 className="text-blue-400 font-semibold text-base mb-2">
								Origin
							</h3>
							<p className="text-green-300">{wordInfo.origin}</p>
						</section>
					)}

					{/* Relate With */}
					{wordInfo.relate_with && (
						<section>
							<h3 className="text-blue-400 font-semibold text-base mb-2">
								Relate With
							</h3>
							<p className="text-orange-300">{wordInfo.relate_with}</p>
						</section>
					)}

					{/* Mnemonic */}
					{wordInfo.mnemonic && (
						<section>
							<h3
								className="text-blue-400 font-semibold text-base mb-2

"
							>
								Mnemonic
							</h3>
							<p className="text-pink-300">
								{highlightMnemonic(wordInfo.mnemonic, wordInfo.word)}
							</p>
						</section>
					)}

					{/* Breakdown */}
					{wordInfo.breakdown && (
						<section>
							<h3 className="text-blue-400 font-semibold text-base mb-2">
								Breakdown
							</h3>
							<p className="text-lime-300">{wordInfo.breakdown}</p>
						</section>
					)}

					{/* Synonyms & Antonyms */}
					{(wordInfo?.synonyms?.length > 0 ||
						wordInfo?.antonyms?.length > 0) && (
						<section className="flex flex-wrap gap-6 pt-3 border-t border-neutral-700">
							{wordInfo?.synonyms?.length > 0 && (
								<div>
									<h3 className="text-blue-400 font-semibold text-base mb-2">
										Synonyms
									</h3>
									<div className="flex flex-wrap gap-2">
										{wordInfo.synonyms.map((syn, idx) => (
											<span
												key={idx}
												className="bg-green-900/40 text-green-300 border border-green-600/50 rounded-full px-3 py-1 text-xs font-medium hover:bg-green-800/50 transition-colors duration-200"
											>
												{syn}
											</span>
										))}
									</div>
								</div>
							)}
							{wordInfo?.antonyms?.length > 0 && (
								<div>
									<h3 className="text-blue-400 font-semibold text-base mb-2">
										Antonyms
									</h3>
									<div className="flex flex-wrap gap-2">
										{wordInfo.antonyms.map((ant, idx) => (
											<span
												key={idx}
												className="bg-red-900/40 text-red-300 border border-red-600/50 rounded-full px-3 py-1 text-xs font-medium hover:bg-red-800/50 transition-colors duration-200"
											>
												{ant}
											</span>
										))}
									</div>
								</div>
							)}
						</section>
					)}
				</div>
			</div>
		</div>
	);
};

export default WordInfo;
