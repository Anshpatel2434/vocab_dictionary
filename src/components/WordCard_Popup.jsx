// WordCard_Popup.jsx
import React from "react";

const WordCard_Popup = ({ word, difficulty }) => {
	const styles = {
		challenging: "bg-red-900/50 text-red-300",
		intermediate: "bg-yellow-900/50 text-yellow-300",
		familiar: "bg-green-900/50 text-green-300",
	};
	return (
		<div
			className={`p-2 rounded-lg text-sm transition-colors duration-300 ${styles[difficulty]}`}
		>
			{word}
		</div>
	);
};

export default WordCard_Popup;
