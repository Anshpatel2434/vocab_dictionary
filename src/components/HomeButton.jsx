// HomeButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react"; // Using a consistent icon library

const HomeButton = ({ className = "" }) => {
	const navigate = useNavigate();

	return (
		<div className={`fixed top-5 left-5 z-50 ${className}`}>
			<button
				onClick={() => navigate("/home")}
				className="group relative w-12 h-12 flex items-center justify-center"
				aria-label="Go to Home"
			>
				{/* NEW: Orbital glow effect on hover */}
				<div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-lg opacity-0 group-hover:opacity-60 group-focus:opacity-60 transition-opacity duration-300"></div>

				{/* NEW: Main button with Acrylic/Glassmorphism style */}
				<div className="absolute inset-0 bg-neutral-800/50 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:border-white/20"></div>

				{/* Icon with its own transition */}
				<Home
					className="relative w-6 h-6 text-neutral-300 transition-all duration-300 group-hover:text-white group-hover:scale-110"
					strokeWidth={2}
				/>

				{/* NEW: Redesigned Tooltip */}
				<div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-md text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300 pointer-events-none transform group-hover:translate-x-0 -translate-x-2">
					Go to Home
					<div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-900 border-l border-b border-neutral-700 rotate-45"></div>
				</div>
			</button>
		</div>
	);
};

export default HomeButton;
