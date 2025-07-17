// WordCard_Revise.jsx
import React, { useState } from "react";

const WordCard_Revise = ({ word }) => {
	const [isFlipped, setIsFlipped] = useState(false);

	const getStatusInfo = (openedCount) => {
		const opened = openedCount || 0;
		if (opened === 0)
			return {
				text: "New",
				style: "bg-red-900/50 text-red-400 border border-red-500/30",
			};
		if (opened <= 2)
			return {
				text: "Learning",
				style: "bg-yellow-900/50 text-yellow-400 border border-yellow-500/30",
			};
		return {
			text: "Known",
			style: "bg-green-900/50 text-green-400 border border-green-500/30",
		};
	};

	const status = getStatusInfo(word.no_of_times_opened);

	return (
		// The onClick handler for the entire container toggles the flip state
		<div
			className="perspective-1000 w-full h-52"
			onClick={() => setIsFlipped(!isFlipped)}
		>
			<div
				className={`relative w-full h-full transform-style-3d transition-transform duration-500 ${
					isFlipped ? "rotate-y-180" : ""
				}`}
			>
				{/* --- Card Front --- */}
				<div className="absolute w-full h-full backface-hidden flex flex-col justify-between p-4 rounded-xl bg-neutral-900 border border-neutral-700 cursor-pointer hover:border-cyan-500 transition-colors duration-300 shadow-lg">
					<div>
						<div
							className={`inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3 ${status.style}`}
						>
							{status.text}
						</div>
						<h3 className="text-xl font-bold text-white">{word.word}</h3>
						<p className="text-sm text-neutral-400 font-mono mt-1">
							{word.pronunciation?.split("|")[0]}
						</p>
					</div>
					<div className="text-xs text-neutral-500">
						<p>
							Opened: {word.no_of_times_opened || 0} • Revised:{" "}
							{word.no_of_times_revised || 0}
						</p>
						<p className="text-center font-bold mt-2">Click to Reveal</p>
					</div>
				</div>

				{/* --- Card Back --- */}
				<div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col p-4 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-700 border border-cyan-500 shadow-lg">
					<div className="flex-grow overflow-y-auto pr-2 space-y-2 text-sm">
						{word.meaning?.map((m, i) => (
							<div key={i}>
								<p className="font-semibold text-yellow-300">{m.meaning}</p>
								{m.example && (
									<p className="italic text-yellow-200/70 text-xs mt-1">
										"{m.example}"
									</p>
								)}
							</div>
						))}
						{word.mnemonic && (
							<div className="pt-2 mt-2 border-t border-neutral-600">
								<p className="font-semibold text-pink-300">{word.mnemonic}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default WordCard_Revise;
