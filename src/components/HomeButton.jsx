import React from "react";
import { useNavigate } from "react-router-dom";

const HomeButton = ({ className = "" }) => {
	const navigate = useNavigate();

	return (
		<button
			onClick={() => navigate("/home")}
			className={`fixed top-6 left-6 z-50 group ${className}`}
			aria-label="Go to Home"
		>
			<div className="relative">
				{/* Main button */}
				<div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 border-2 border-blue-400/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group-hover:scale-110 group-hover:shadow-blue-500/25">
					<svg
						className="w-6 h-6 text-white group-hover:text-blue-100 transition-colors duration-200"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
						></path>
					</svg>
				</div>

				{/* Subtle glow effect */}
				<div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

				{/* Tooltip */}
				<div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
					<div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg border border-gray-700 shadow-lg whitespace-nowrap">
						Home
						{/* Tooltip arrow */}
						<div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 border-l border-b border-gray-700 rotate-45"></div>
					</div>
				</div>
			</div>
		</button>
	);
};

export default HomeButton;

// Alternative compact version for smaller screens
export const CompactHomeButton = ({ className = "" }) => {
	const navigate = useNavigate();

	return (
		<button
			onClick={() => navigate("/")}
			className={`w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 border border-blue-400/50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-105 group ${className}`}
			aria-label="Go to Home"
		>
			<svg
				className="w-5 h-5 text-white group-hover:text-blue-100 transition-colors duration-200"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
				></path>
			</svg>
		</button>
	);
};

// Usage examples in your components:

// Example 1: Fixed position home button (add to any page)
// <HomeButton />

// Example 2: Inline home button in a navigation bar
// <CompactHomeButton className="relative top-auto left-auto" />

// Example 3: Mobile-friendly version
// <div className="md:hidden">
//   <CompactHomeButton className="fixed top-4 left-4 z-50" />
// </div>
// <div className="hidden md:block">
//   <HomeButton />
// </div>
