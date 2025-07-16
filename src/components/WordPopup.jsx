import React, { useEffect, useRef } from "react";

const WordPopup = ({ word, onClose, position }) => {
	const popupRef = useRef(null);

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

	const getPopupStyle = () => {
		return {
			position: "absolute",
			left: position.x,
			top: position.y + 20, // small offset below the word
			transform: "translateX(-50%)",
			zIndex: 100,
		};
	};

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
		<div style={getPopupStyle()} className="z-50">
			{/* Tail pointer */}
			<div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
				<div className="w-4 h-4 bg-gradient-to-br from-neutral-900 to-neutral-800 border-l border-t border-neutral-700 rotate-45"></div>
			</div>

			{/* Popup container */}
			<div
				ref={popupRef}
				className="relative bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-2xl shadow-md hover:shadow-xl p-5 w-80 max-h-[70vh] overflow-y-auto animate-fade-in transition-all duration-200"
			>
				{/* Header */}
				<div className="flex justify-between items-start mb-4 pb-2 border-b border-neutral-700">
					<div>
						<h3 className="text-lg font-bold text-white tracking-tight">
							{word.word}
						</h3>
						{word.pronunciation && (
							<p className="text-blue-300 text-sm mt-1">
								/{word.pronunciation}/
							</p>
						)}
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-blue-400 text-lg px-2 rounded hover:bg-neutral-700/50 transition-colors duration-200"
						aria-label="Close popup"
					>
						×
					</button>
				</div>

				{/* Content */}
				<div className="space-y-4 text-sm text-gray-200">
					{/* Meanings */}
					{word.meaning?.length > 0 && (
						<div>
							<h4 className="text-base font-semibold text-blue-400 mb-2">
								Meanings
							</h4>
							{word.meaning.map((m, i) => (
								<div key={i} className="mb-2">
									<p className="text-yellow-300 font-medium leading-relaxed">
										{m.meaning}
									</p>
									{m.example && (
										<p className="text-yellow-200/80 text-xs italic mt-1 pl-3 border-l border-blue-600">
											"{m.example}"
										</p>
									)}
								</div>
							))}
						</div>
					)}

					{/* Synonyms */}
					{word.synonyms?.length > 0 && (
						<div>
							<h4 className="text-base font-semibold text-blue-400 mb-2">
								Synonyms
							</h4>
							<div className="flex flex-wrap gap-2">
								{word.synonyms.map((syn, i) => (
									<span
										key={i}
										className="px-3 py-1 bg-green-900/40 text-green-300 text-xs rounded-full border border-green-600/50 hover:bg-green-800/50 transition-colors duration-200"
									>
										{syn}
									</span>
								))}
							</div>
						</div>
					)}

					{/* Antonyms */}
					{word.antonyms?.length > 0 && (
						<div>
							<h4 className="text-base font-semibold text-blue-400 mb-2">
								Antonyms
							</h4>
							<div className="flex flex-wrap gap-2">
								{word.antonyms.map((ant, i) => (
									<span
										key={i}
										className="px-3 py-1 bg-red-900/40 text-red-300 text-xs rounded-full border border-red-600/50 hover:bg-red-800/50 transition-colors duration-200"
									>
										{ant}
									</span>
								))}
							</div>
						</div>
					)}

					{/* Origin */}
					{word.origin && (
						<div>
							<h4 className="text-base font-semibold text-blue-400 mb-2">
								Origin
							</h4>
							<p className="text-green-300 leading-relaxed">{word.origin}</p>
						</div>
					)}

					{/* Context */}
					{word.relate_with && (
						<div>
							<h4 className="text-base font-semibold text-blue-400 mb-2">
								Context
							</h4>
							<p className="text-orange-300 leading-relaxed">
								{word.relate_with}
							</p>
						</div>
					)}

					{/* Mnemonic */}
					{word.mnemonic && (
						<div>
							<h4 className="text-base font-semibold text-blue-400 mb-2">
								Mnemonic
							</h4>
							<p className="text-pink-300 leading-relaxed">
								{highlightMnemonic(word.mnemonic, word.word)}
							</p>
						</div>
					)}

					{/* Breakdown */}
					{word.breakdown && (
						<div>
							<h4 className="text-base font-semibold text-blue-400 mb-2">
								Breakdown
							</h4>
							<p className="text-lime-300 leading-relaxed">{word.breakdown}</p>
						</div>
					)}
				</div>

				{/* Footer Stats */}
				<div className="flex justify-between text-xs text-gray-500 mt-4 pt-3 border-t border-neutral-700">
					<span>👁️ Viewed: {word.no_of_times_opened || 0}</span>
					<span>♻️ Revised: {word.no_of_times_revised || 0}</span>
				</div>
			</div>
		</div>
	);
};

export default WordPopup;
