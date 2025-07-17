import React, { useEffect, useRef } from "react";
import {
	BookOpen,
	Anchor,
	Lightbulb,
	BrainCircuit,
	Puzzle,
	X,
} from "lucide-react";

const WordPopup = ({ word, onClose, position }) => {
	const popupRef = useRef(null);

	// Click outside and Escape key listeners
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (popupRef.current && !popupRef.current.contains(event.target)) {
				onClose();
			}
		};
		const handleEscapeKey = (event) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscapeKey);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscapeKey);
		};
	}, [onClose]);

	if (!word || !position) return null;

	const getPopupStyle = () => ({
		position: "absolute",
		left: `${position.x}px`,
		top: `${position.y + 25}px`, // Slightly more offset
		transform: "translateX(-50%)",
		zIndex: 1000,
	});

	// Re-using the improved pronunciation renderer
	const renderPronunciation = (pronunciation) => {
		if (!pronunciation) return null;
		const parts = pronunciation.split("|");
		return (
			<div className="flex items-center text-sm mt-1">
				<span className="text-blue-300 font-mono tracking-tighter">
					{parts[0].trim()}
				</span>
				{parts[1] && (
					<>
						<span className="text-neutral-500 mx-1.5">|</span>
						<span className="text-blue-200/90 font-medium">
							{parts[1].trim()}
						</span>
					</>
				)}
			</div>
		);
	};

	return (
		<div style={getPopupStyle()}>
			{/* NEW: Added group class and smooth entry animation */}
			<div
				ref={popupRef}
				className="group relative w-80 max-w-sm animate-fade-scale-in"
			>
				{/* NEW: Tail pointer with gradient glow */}
				<div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-neutral-800 border-l border-t border-neutral-700 rotate-45 z-0">
					<div className="absolute inset-0 bg-gradient-to-br from-cyan-500/50 to-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
				</div>

				{/* NEW: Container with gradient glow effect */}
				<div className="relative rounded-2xl bg-neutral-900 p-[1px] shadow-2xl shadow-black/50">
					<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/50 to-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>

					<div className="relative bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-[15px] p-5 max-h-[75vh] overflow-y-auto">
						{/* Header */}
						<div className="flex justify-between items-start pb-3 mb-3 border-b border-neutral-700">
							<div>
								<h3 className="text-lg font-bold text-white tracking-tight">
									{word.word}
								</h3>
								{renderPronunciation(word.pronunciation)}
							</div>
							<button
								onClick={onClose}
								className="p-1.5 text-neutral-400 rounded-full hover:bg-neutral-700/80 hover:text-white transition-colors duration-200"
								aria-label="Close popup"
							>
								<X size={18} />
							</button>
						</div>

						{/* Content Body */}
						<div className="space-y-4 text-sm text-gray-200">
							{/* Meanings */}
							{word.meaning?.length > 0 && (
								<div className="space-y-2">
									{word.meaning.map((m, i) => (
										<div key={i}>
											<p className="flex items-start gap-2 text-yellow-300 font-medium">
												<BookOpen
													size={16}
													className="mt-0.5 flex-shrink-0 text-blue-400"
												/>
												<span>{m.meaning}</span>
											</p>
											{m.example && (
												<p className="text-yellow-200/70 text-xs italic mt-1 pl-6">
													"{m.example}"
												</p>
											)}
										</div>
									))}
								</div>
							)}

							{/* Mental Hook */}
							{word.relate_with && (
								<div className="bg-cyan-900/40 border border-cyan-700/60 rounded-lg p-3">
									<h4 className="flex items-center gap-2 text-cyan-300 font-semibold mb-1.5 text-xs uppercase tracking-wider">
										<Lightbulb size={14} /> Mental Hook
									</h4>
									<p className="text-cyan-200 text-sm">{word.relate_with}</p>
								</div>
							)}

							{/* Mnemonic and Breakdown */}
							{word.mnemonic && (
								<div className="space-y-3">
									<div>
										<h4 className="flex items-center gap-2 text-blue-400 font-semibold mb-1.5 text-xs uppercase tracking-wider">
											<BrainCircuit size={14} /> Mnemonic
										</h4>
										<p className="text-pink-300 leading-relaxed">
											{word.mnemonic}{" "}
											{/* You can reuse highlightMnemonic here if you pass word.word */}
										</p>
									</div>
									{word.breakdown && (
										<div>
											<h4 className="flex items-center gap-2 text-blue-400 font-semibold mb-1.5 text-xs uppercase tracking-wider">
												<Puzzle size={14} /> Breakdown
											</h4>
											<p className="text-lime-300 leading-relaxed">
												{word.breakdown}
											</p>
										</div>
									)}
								</div>
							)}

							{/* Origin */}
							{word.origin && (
								<div>
									<h4 className="flex items-center gap-2 text-blue-400 font-semibold mb-1.5 text-xs uppercase tracking-wider">
										<Anchor size={14} /> Origin
									</h4>
									<p className="text-green-300 leading-relaxed">
										{word.origin}
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

export default WordPopup;
