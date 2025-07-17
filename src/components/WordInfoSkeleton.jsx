// WordInfoSkeleton.jsx
import React from "react";

const WordInfoSkeleton = () => {
	return (
		<div className="w-full mb-3 bg-neutral-900 rounded-2xl border border-neutral-800 p-5 shadow-md animate-pulse">
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-4">
					<div className="h-7 w-32 bg-neutral-700 rounded-md"></div>
					<div className="h-5 w-48 bg-neutral-700 rounded-md"></div>
				</div>
				<div className="h-6 w-6 bg-neutral-700 rounded-md"></div>
			</div>
		</div>
	);
};

export default WordInfoSkeleton;
