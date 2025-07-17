// WordCard.jsx
import React, { useState } from "react";
import { CheckCircle, BookOpen, BrainCircuit } from "lucide-react";

const WordCard = ({ word, onCardClick, isClicked }) => {
	const [isFlipped, setIsFlipped] = useState(false);

	const handleFlip = () => {
		setIsFlipped(!isFlipped);
		// Notify parent component that this card was interacted with
		onCardClick(word);
	};

	return (
		<div className="perspective-1000 w-full h-32" onClick={handleFlip}>
			<div
				className={`relative w-full h-full transform-style-3d transition-transform duration-500 ${
					isFlipped ? "rotate-y-180" : ""
				}`}
			>
				{/* Front of the Card */}
				<div className="absolute w-full h-full backface-hidden flex items-center justify-center p-4 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 hover:border-cyan-500 transition-colors duration-300 cursor-pointer">
					<h3 className="text-lg font-bold text-white text-center">
						{word.word}
					</h3>
					{isClicked && (
						<CheckCircle
							size={20}
							className="absolute top-2 right-2 text-green-500"
						/>
					)}
				</div>

				{/* Back of the Card */}
				<div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col justify-between p-4 rounded-xl bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-700 overflow-hidden">
					<div className="space-y-1 overflow-y-auto pr-1">
						{word.meaning?.[0] && (
							<div className="flex items-start gap-2 text-xs">
								<BookOpen
									size={14}
									className="text-cyan-300 mt-0.5 flex-shrink-0"
								/>
								<p className="text-yellow-300">{word.meaning[0].meaning}</p>
							</div>
						)}
						{word.mnemonic && (
							<div className="flex items-start gap-2 text-xs pt-1">
								<BrainCircuit
									size={14}
									className="text-cyan-300 mt-0.5 flex-shrink-0"
								/>
								<p className="text-pink-300 italic">{word.mnemonic}</p>
							</div>
						)}
					</div>
					<div className="text-center text-xs text-neutral-400 pt-1 font-bold">
						Click to flip back
					</div>
				</div>
			</div>
		</div>
	);
};

export default WordCard;
