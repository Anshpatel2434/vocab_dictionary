import React, { useState } from "react";

const WordInfo = ({ wordInfo }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<div className="w-full mb-4 bg-black rounded-lg shadow-lg border border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-gray-700/10">
			{/* Word header (always visible) */}
			<button
				onClick={toggleExpand}
				className="w-full flex justify-between items-center p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/50"
			>
				<div className="flex items-center">
					<h2 className="text-xl font-bold text-white">{wordInfo.word}</h2>
					{wordInfo.pronunciation && (
						<span className="ml-3 text-cyan-400 text-sm font-medium">
							{wordInfo.pronunciation}
						</span>
					)}
				</div>
				<div className="text-blue-400">
					{isExpanded ? (
						<svg
							className="w-5 h-5 transform transition-transform duration-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M5 15l7-7 7 7"
							></path>
						</svg>
					) : (
						<svg
							className="w-5 h-5 transform transition-transform duration-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M19 9l-7 7-7-7"
							></path>
						</svg>
					)}
				</div>
			</button>

			{/* Expandable content with smooth animation */}
			<div
				className={`overflow-hidden transition-all duration-500 ease-in-out ${
					isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className="px-4 pb-4 text-gray-300">
					{/* Meanings and examples */}
					{wordInfo?.meaning && wordInfo.meaning.length > 0 && (
						<div className="mb-4 border-t border-gray-800 pt-4">
							<h3 className="text-blue-400 font-semibold mb-2">
								Meaning & Examples
							</h3>
							{wordInfo.meaning.map((item, index) => (
								<div
									key={index}
									className="mb-3 pl-2 border-l-2 border-blue-800"
								>
									<div className="text-yellow-300 font-medium">
										{item.meaning}
									</div>
									{item.example && (
										<div className="mt-1 text-amber-200/80 italic">
											"{item.example}"
										</div>
									)}
								</div>
							))}
						</div>
					)}

					{/* Origin */}
					{wordInfo.origin && (
						<div className="mb-4 border-t border-gray-800 pt-4">
							<h3 className="text-blue-400 font-semibold mb-2">Origin</h3>
							<div className="text-teal-300">{wordInfo.origin}</div>
						</div>
					)}

					{/* Related with */}
					{wordInfo.relate_with && (
						<div className="mb-4 border-t border-gray-800 pt-4">
							<h3 className="text-blue-400 font-semibold mb-2">Related With</h3>
							<div className="text-orange-300">{wordInfo.relate_with}</div>
						</div>
					)}

					{/* Synonyms and Antonyms */}
					{(wordInfo?.synonyms?.length > 0 ||
						wordInfo?.antonyms?.length > 0) && (
						<div className="border-t border-gray-800 pt-4">
							<div className="flex flex-wrap gap-4">
								{/* Synonyms */}
								{wordInfo?.synonyms?.length > 0 && (
									<div className="flex-1 min-w-fit">
										<h3 className="text-blue-400 font-semibold mb-2">
											Synonyms
										</h3>
										<div className="flex flex-wrap gap-2">
											{wordInfo.synonyms.map((item, index) => (
												<span
													key={index}
													className="px-2 py-1 bg-green-900/40 text-green-400 rounded text-sm border border-green-700/50 transition-all duration-200 hover:bg-green-900/60"
												>
													{item}
												</span>
											))}
										</div>
									</div>
								)}

								{/* Antonyms */}
								{wordInfo?.antonyms?.length > 0 && (
									<div className="flex-1 min-w-fit">
										<h3 className="text-blue-400 font-semibold mb-2">
											Antonyms
										</h3>
										<div className="flex flex-wrap gap-2">
											{wordInfo.antonyms.map((item, index) => (
												<span
													key={index}
													className="px-2 py-1 bg-red-900/40 text-red-400 rounded text-sm border border-red-700/50 transition-all duration-200 hover:bg-red-900/60"
												>
													{item}
												</span>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default WordInfo;
