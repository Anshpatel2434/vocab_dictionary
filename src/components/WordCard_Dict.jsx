// WordCard_Dict.jsx
import React, { useState } from "react";
import { BookOpen, BrainCircuit } from "lucide-react";

const WordCard_Dict = ({ wordInfo }) => {
	const [isFlipped, setIsFlipped] = useState(false);

	return (
		<div
			className="perspective-1000 w-full h-72 group"
			onClick={() => setIsFlipped(!isFlipped)}
		>
			<div
				className={`relative w-full h-full transform-style-3d transition-transform duration-500 ${
					isFlipped ? "rotate-y-180" : ""
				}`}
			>
				{/* --- Card Front --- */}
				<div className="absolute w-full h-full backface-hidden flex flex-col justify-between p-5 rounded-2xl bg-neutral-900 border border-neutral-700 cursor-pointer group-hover:border-cyan-500 transition-colors duration-300 shadow-lg">
					<div className="flex-grow">
						<h3 className="text-2xl font-bold text-white">{wordInfo.word}</h3>
						<p className="text-sm text-neutral-400 font-mono mt-1">
							{wordInfo.pronunciation?.split("|")[0]}
						</p>
						<div className="mt-4 pt-4 border-t border-neutral-800">
							<div className="flex items-start gap-3 text-cyan-300">
								<BookOpen size={18} className="mt-1 flex-shrink-0" />
								<p className="text-base font-semibold leading-snug">
									{wordInfo.meaning[0]?.meaning}
								</p>
							</div>
						</div>
					</div>
					<div className="text-xs text-neutral-500 text-center font-semibold">
						Click to see all details
					</div>
				</div>

				{/* --- Card Back --- */}
				<div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col p-5 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-700 border border-cyan-500 shadow-xl shadow-cyan-900/30">
					<h3 className="text-xl font-bold text-white mb-2 pb-2 border-b border-neutral-600">
						{wordInfo.word}
					</h3>
					<div className="flex-grow overflow-y-auto pr-2 space-y-3 text-sm">
						{/* Meanings */}
						<div>
							<h4 className="font-bold text-cyan-400 text-xs uppercase mb-1">
								Meanings
							</h4>
							{wordInfo.meaning?.map((m, i) => (
								<div key={i} className="mb-2">
									<p className="font-semibold text-yellow-300">{m.meaning}</p>
									{m.example && (
										<p className="italic text-yellow-200/70 text-xs mt-1">
											"{m.example}"
										</p>
									)}
								</div>
							))}
						</div>
						{/* Mnemonic */}
						{wordInfo.mnemonic && (
							<div className="pt-2 border-t border-neutral-700/50">
								<h4 className="font-bold text-cyan-400 text-xs uppercase mb-1">
									Mnemonic
								</h4>
								<p className="font-semibold text-pink-300">
									{wordInfo.mnemonic}
								</p>
							</div>
						)}
						{/* Breakdown */}
						{wordInfo.breakdown && (
							<div className="pt-2 border-t border-neutral-700/50">
								<h4 className="font-bold text-cyan-400 text-xs uppercase mb-1">
									Breakdown
								</h4>
								<p className="text-lime-300">{wordInfo.breakdown}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

// Skeleton loader for the card
export const WordCardSkeleton = () => (
	<div className="w-full h-72 p-5 rounded-2xl bg-neutral-900 border border-neutral-800 animate-pulse">
		<div className="h-8 bg-neutral-700 rounded w-1/2 mb-2"></div>
		<div className="h-4 bg-neutral-700 rounded w-1/3 mb-6"></div>
		<div className="h-5 bg-neutral-700 rounded w-3/4"></div>
	</div>
);

export default WordCard_Dict;
