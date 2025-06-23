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

	return (
		<div style={getPopupStyle()} className="z-50">
			{/* Tail pointer */}
			<div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
				<div className="w-4 h-4 bg-gray-900 border-l border-t border-gray-600 rotate-45"></div>
			</div>

			{/* Popup container */}
			<div
				ref={popupRef}
				className="relative bg-gray-900 border border-gray-600 rounded-xl shadow-2xl p-5 w-80 max-h-[70vh] overflow-y-auto animate-fade-in transition-all duration-200"
			>
				{/* Header */}
				<div className="flex justify-between items-start mb-4 pb-2 border-b border-gray-700">
					<div>
						<h3 className="text-lg font-bold text-white">{word.word}</h3>
						{word.pronunciation && (
							<p className="text-blue-400 text-sm mt-1">
								/{word.pronunciation}/
							</p>
						)}
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-white text-lg px-2 rounded hover:bg-gray-800 transition-colors"
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
							<h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
								Meanings
							</h4>
							{word.meaning.map((m, i) => (
								<div key={i} className="mb-2">
									<p className="leading-relaxed">{m.meaning}</p>
									{m.example && (
										<p className="text-gray-400 text-xs italic mt-1 pl-3 border-l border-gray-700">
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
							<h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
								Synonyms
							</h4>
							<div className="flex flex-wrap gap-1">
								{word.synonyms.map((syn, i) => (
									<span
										key={i}
										className="px-2 py-1 bg-green-800/30 text-green-300 text-xs rounded border border-green-600"
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
							<h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
								Antonyms
							</h4>
							<div className="flex flex-wrap gap-1">
								{word.antonyms.map((ant, i) => (
									<span
										key={i}
										className="px-2 py-1 bg-red-800/30 text-red-300 text-xs rounded border border-red-600"
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
							<h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
								Origin
							</h4>
							<p className="leading-relaxed">{word.origin}</p>
						</div>
					)}

					{/* Context */}
					{word.relate_with && (
						<div>
							<h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
								Context
							</h4>
							<p className="leading-relaxed">{word.relate_with}</p>
						</div>
					)}
				</div>

				{/* Footer Stats */}
				<div className="flex justify-between text-xs text-gray-500 mt-4 pt-3 border-t border-gray-700">
					<span>👁️ Viewed: {word.no_of_times_opened || 0}</span>
					<span>♻️ Revised: {word.no_of_times_revised || 0}</span>
				</div>
			</div>
		</div>
	);
};

export default WordPopup;
