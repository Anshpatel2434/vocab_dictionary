// RevisionPage.jsx
import React, { useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import HomeButton from "./HomeButton";
import {
	TrendingDown,
	Flame,
	BookMarked,
	Star,
	EyeOff,
	Sparkles,
	ArrowRight,
} from "lucide-react";

const RevisionPage = () => {
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	const navigate = useNavigate();

	// NEW: Upgraded wordTypes with professional icons and modern styling
	const wordTypes = [
		{
			type: "least_revised",
			title: "Least Revised",
			description: "Focus on words you haven't practiced in a while.",
			Icon: TrendingDown,
			style:
				"from-emerald-500/10 to-neutral-900 border-emerald-500/30 hover:border-emerald-500",
			glow: "group-hover:shadow-emerald-500/20",
			button: "group-hover:bg-emerald-600",
		},
		{
			type: "most_difficult",
			title: "Most Difficult",
			description: "Challenge yourself with your most frequently opened words.",
			Icon: Flame,
			style:
				"from-red-500/10 to-neutral-900 border-red-500/30 hover:border-red-500",
			glow: "group-hover:shadow-red-500/20",
			button: "group-hover:bg-red-600",
		},
		{
			type: "newest_first",
			title: "Newest Words",
			description: "Practice the most recent additions to your vocabulary.",
			Icon: Sparkles,
			style:
				"from-cyan-500/10 to-neutral-900 border-cyan-500/30 hover:border-cyan-500",
			glow: "group-hover:shadow-cyan-500/20",
			button: "group-hover:bg-cyan-600",
		},
		{
			type: "most_revised",
			title: "Most Practiced",
			description: "Solidify your knowledge of words you revise often.",
			Icon: Star,
			style:
				"from-purple-500/10 to-neutral-900 border-purple-500/30 hover:border-purple-500",
			glow: "group-hover:shadow-purple-500/20",
			button: "group-hover:bg-purple-600",
		},
		{
			type: "least_opened",
			title: "Least Opened",
			description: "Discover words that you haven't explored much yet.",
			Icon: EyeOff,
			style:
				"from-yellow-500/10 to-neutral-900 border-yellow-500/30 hover:border-yellow-500",
			glow: "group-hover:shadow-yellow-500/20",
			button: "group-hover:bg-yellow-600",
		},
		{
			type: "normal",
			title: "Normal Sequence",
			description: "Go through your vocabulary in its standard order.",
			Icon: BookMarked,
			style:
				"from-blue-500/10 to-neutral-900 border-blue-500/30 hover:border-blue-500",
			glow: "group-hover:shadow-blue-500/20",
			button: "group-hover:bg-blue-600",
		},
	];

	useEffect(() => {
		verifyLogin();
	}, []);

	// Logic for verifying login remains unchanged
	async function verifyLogin() {
		try {
			const res = await axios.post(`${BACKEND_URL}/api/v1/verifyPassword`, {
				password: localStorage.getItem("vocabToken"),
			});
			if (res.status !== 200) {
				toast.error(res.data.message);
				navigate("/");
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Authentication failed");
			navigate("/");
		}
	}

	const handleTypeSelection = (type) => {
		navigate(`/revisionPage/1?type=${type}`);
	};

	return (
		<div className="min-h-screen bg-neutral-950 text-white">
			<Toaster
				position="top-center"
				toastOptions={{ style: { background: "#333", color: "#fff" } }}
			/>

			<div className="absolute top-0 left-0 p-4 z-10">
				<HomeButton />
			</div>

			{/* NEW: Upgraded Header / Hero Section */}
			<main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<div className="text-center mb-12 animate-fade-in">
					<h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl tracking-tight">
						Revision <span className="text-cyan-400">Center</span>
					</h1>
					<p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-400">
						Choose your learning path. Each mode is designed to strengthen a
						different aspect of your vocabulary.
					</p>
				</div>

				{/* NEW: Upgraded Selection Grid with new cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{wordTypes.map((typeInfo, index) => (
						<div
							key={typeInfo.type}
							onClick={() => handleTypeSelection(typeInfo.type)}
							// NEW: Staggered animation for each card
							className="group relative p-6 bg-gradient-to-br rounded-2xl border cursor-pointer transition-all duration-300 hover:-translate-y-1 animate-stagger-in shadow-lg"
							style={{ animationDelay: `${index * 100}ms` }}
						>
							{/* Applying styles from the array */}
							<div
								className={`absolute inset-0 bg-gradient-to-br rounded-2xl border transition-colors ${typeInfo.style}`}
							></div>
							<div
								className={`absolute inset-0 rounded-2xl shadow-2xl opacity-0 transition-all duration-300 ${typeInfo.glow}`}
							></div>

							<div className="relative z-10 flex flex-col h-full">
								<div className="mb-4">
									<typeInfo.Icon className="h-8 w-8 text-neutral-300" />
								</div>
								<h3 className="text-xl font-bold text-white mb-2">
									{typeInfo.title}
								</h3>
								<p className="text-neutral-400 text-sm flex-grow">
									{typeInfo.description}
								</p>
								<div
									className={`mt-6 flex items-center justify-between text-sm font-semibold text-white`}
								>
									<span>Launch Session</span>
									<div
										className={`p-1.5 rounded-full bg-neutral-700/50 transition-colors duration-300 ${typeInfo.button}`}
									>
										<ArrowRight size={16} />
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</main>
		</div>
	);
};

export default RevisionPage;
