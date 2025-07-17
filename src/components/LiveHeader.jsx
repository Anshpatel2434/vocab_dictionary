// LiveHeader.jsx
import React from "react";
import { Flag, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LiveHeader = ({
	progress,
	viewedCount,
	totalCount,
	onEndSession,
	onNextPage,
	isLastPage,
	sessionType,
	page,
	totalPages,
}) => {
	const navigate = useNavigate();
	const radius = 54;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (progress / 100) * circumference;

	return (
		<header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<div className="flex items-center justify-between gap-4">
					<button
						onClick={() => navigate("/home")}
						className="p-2 rounded-full hover:bg-neutral-700 transition-colors"
					>
						<Home size={20} className="text-neutral-300" />
					</button>
					{/* Stats Section */}
					<div className="flex-1 flex items-center justify-center gap-8">
						<div className="text-center">
							<div className="text-2xl font-bold text-white">
								{viewedCount} / {totalCount}
							</div>
							<div className="text-xs text-neutral-400 uppercase tracking-wider">
								Words Viewed
							</div>
						</div>
						<div className="relative w-32 h-32">
							<svg className="w-full h-full" viewBox="0 0 120 120">
								<circle
									className="text-neutral-700"
									strokeWidth="8"
									stroke="currentColor"
									fill="transparent"
									r={radius}
									cx="60"
									cy="60"
								/>
								<circle
									className="text-cyan-400"
									strokeWidth="8"
									stroke="currentColor"
									fill="transparent"
									r={radius}
									cx="60"
									cy="60"
									strokeDasharray={circumference}
									strokeDashoffset={offset}
									strokeLinecap="round"
									style={{
										transition: "stroke-dashoffset 0.35s",
										transform: "rotate(-90deg)",
										transformOrigin: "center",
									}}
								/>
							</svg>
							<div className="absolute inset-0 flex flex-col items-center justify-center">
								<div className="text-3xl font-bold text-white">
									{Math.round(progress)}%
								</div>
								<div className="text-xs text-neutral-400">Progress</div>
							</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-white">
								{page} / {totalPages}
							</div>
							<div className="text-xs text-neutral-400 uppercase tracking-wider">
								Page
							</div>
						</div>
					</div>
					{/* Action Buttons */}
					<div className="flex items-center gap-3">
						{!isLastPage && (
							<button
								onClick={onNextPage}
								className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
							>
								<span>Next Page</span>
								<ArrowRight size={16} />
							</button>
						)}
						<button
							onClick={onEndSession}
							className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
						>
							<Flag size={16} />
							<span>Complete</span>
						</button>
					</div>
				</div>
			</div>
		</header>
	);
};

export default LiveHeader;
