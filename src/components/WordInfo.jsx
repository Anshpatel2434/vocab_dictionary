import axios from "axios";
import React, { useState } from "react";
import {
	ChevronDown,
	ChevronUp,
	BookOpen,
	Anchor,
	Lightbulb,
	BrainCircuit,
	Puzzle,
	ArrowRightLeft,
} from "lucide-react";

const WordInfo = ({ wordInfo }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [openCount, setOpenCount] = useState(wordInfo.no_of_times_opened || 0);
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	const toggleExpand = () => {
		const wasExpanded = isExpanded;
		setIsExpanded(!isExpanded);
		if (!wasExpanded) {
			// increaseCount();
		}
	};

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
				if (lastIndex < i) {
					parts.push(
						<span key={`text-${lastIndex}`}>
							{mnemonic.slice(lastIndex, i)}
						</span>
					);
				}
				parts.push(
					<span key={`highlight-${i}`} className="font-bold text-yellow-400">
						{mnemonic[i]}
					</span>
				);
				wordIndex++;
				lastIndex = i + 1;
			}
		}
		if (lastIndex < mnemonic.length) {
			parts.push(<span key={`text-end`}>{mnemonic.slice(lastIndex)}</span>);
		}
		return parts;
	};

	const renderPronunciation = (pronunciation) => {
		if (!pronunciation) return null;
		const parts = pronunciation.split("|");
		return (
			<>
				<span className="text-sm text-blue-300 font-mono tracking-tighter">
					{parts[0].trim()}
				</span>
				{parts[1] && (
					<>
						<span className="text-sm text-neutral-500 mx-1.5">|</span>
						<span className="text-sm text-blue-200/90 font-medium">
							{parts[1].trim()}
						</span>
					</>
				)}
			</>
		);
	};

	return (
		<div className="group w-full mb-4 bg-neutral-900 rounded-2xl border border-neutral-700 shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
			<div className="relative rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 p-[1px] transition-all duration-300 group-hover:p-0">
				<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/50 to-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
				<div className="relative bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-[15px]">
					<button
						onClick={toggleExpand}
						className="w-full flex justify-between items-center px-5 py-4 text-left focus:outline-none transition-colors duration-200"
					>
						<div className="flex items-center gap-4 flex-wrap">
							<h2 className="text-xl font-bold text-white tracking-tight">
								{wordInfo.word}
							</h2>
							<div className="flex items-center">
								{renderPronunciation(wordInfo.pronunciation)}
							</div>
							<span className="text-xs text-green-300 bg-green-900/30 px-2.5 py-1 rounded-full font-semibold">
								{openCount}
							</span>
						</div>
						{isExpanded ? (
							<ChevronUp className="text-blue-400 w-6 h-6 transition-transform duration-300 flex-shrink-0" />
						) : (
							<ChevronDown className="text-blue-400 w-6 h-6 transition-transform duration-300 flex-shrink-0" />
						)}
					</button>

					<div
						className={`overflow-hidden transition-all duration-500 ease-in-out ${
							isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
						}`}
					>
						{/* THIS IS THE CORRECTED LINE - Removed [&>section]:opacity-0 */}
						<div className="px-5 pb-5 text-gray-200 text-sm space-y-5 animate-stagger-in">
							{/* Meaning with Icon */}
							{wordInfo?.meaning?.length > 0 && (
								<section style={{ animationDelay: "100ms" }}>
									<h3 className="flex items-center gap-2 text-blue-400 font-semibold text-base mb-2">
										<BookOpen size={18} /> Meaning & Examples
									</h3>
									{wordInfo.meaning.map((item, index) => (
										<div
											key={index}
											className="border-l-2 border-blue-600 pl-4 mt-2"
										>
											<p className="text-yellow-300 font-medium">
												{item.meaning}
											</p>
											{item.example && (
												<p className="italic text-yellow-200/80 mt-1">
													"{item.example}"
												</p>
											)}
										</div>
									))}
								</section>
							)}

							{/* "Mental Hook" section */}
							{wordInfo.relate_with && (
								<section style={{ animationDelay: "200ms" }}>
									<div className="bg-cyan-900/30 border border-cyan-700/60 rounded-lg p-4">
										<h3 className="flex items-center gap-2 text-cyan-300 font-semibold text-base mb-2">
											<Lightbulb size={18} /> Mental Hook
										</h3>
										<p className="text-cyan-200">{wordInfo.relate_with}</p>
									</div>
								</section>
							)}

							{/* Mnemonic with Icon */}
							{wordInfo.mnemonic && (
								<section style={{ animationDelay: "300ms" }}>
									<h3 className="flex items-center gap-2 text-blue-400 font-semibold text-base mb-2">
										<BrainCircuit size={18} /> Mnemonic
									</h3>
									<p className="text-pink-300 text-base">
										{highlightMnemonic(wordInfo.mnemonic, wordInfo.word)}
									</p>
								</section>
							)}

							{/* Breakdown with Icon */}
							{wordInfo.breakdown && (
								<section style={{ animationDelay: "400ms" }}>
									<h3 className="flex items-center gap-2 text-blue-400 font-semibold text-base mb-2">
										<Puzzle size={18} /> Breakdown
									</h3>
									<p className="text-lime-300">{wordInfo.breakdown}</p>
								</section>
							)}

							{/* Origin with Icon */}
							{wordInfo.origin && (
								<section style={{ animationDelay: "500ms" }}>
									<h3 className="flex items-center gap-2 text-blue-400 font-semibold text-base mb-2">
										<Anchor size={18} /> Origin
									</h3>
									<p className="text-green-300">{wordInfo.origin}</p>
								</section>
							)}

							{/* Synonyms & Antonyms with Icon */}
							{(wordInfo?.synonyms?.length > 0 ||
								wordInfo?.antonyms?.length > 0) && (
								<section
									style={{ animationDelay: "600ms" }}
									className="pt-4 border-t border-neutral-700"
								>
									<h3 className="flex items-center gap-2 text-blue-400 font-semibold text-base mb-3">
										<ArrowRightLeft size={18} /> Related Words
									</h3>
									<div className="flex flex-wrap gap-x-8 gap-y-4">
										{wordInfo?.synonyms?.length > 0 && (
											<div>
												<h4 className="text-green-400 font-bold text-sm mb-2">
													Synonyms
												</h4>
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
												<h4 className="text-red-400 font-bold text-sm mb-2">
													Antonyms
												</h4>
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
									</div>
								</section>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WordInfo;
