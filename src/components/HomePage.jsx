// HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus, Library, BrainCircuit, ArrowRight } from "lucide-react";

const HomePage = () => {
	const navigate = useNavigate();

	// NEW: Data structure for action cards to keep the JSX clean
	const actionCards = [
		{
			title: "Add New Words",
			description:
				"Expand your personal dictionary with the power of AI-assisted learning cards.",
			Icon: FilePlus,
			path: "/addWords",
			style: {
				gradient: "from-cyan-500/20 to-neutral-900",
				border: "border-cyan-500/30 hover:border-cyan-500",
				glow: "group-hover:shadow-cyan-500/20",
				button: "group-hover:bg-cyan-600",
			},
		},
		{
			title: "Explore Dictionary",
			description:
				"Browse, search, and review your entire collection of words at any time.",
			Icon: Library,
			path: "/dictionary/1",
			style: {
				gradient: "from-blue-500/20 to-neutral-900",
				border: "border-blue-500/30 hover:border-blue-500",
				glow: "group-hover:shadow-blue-500/20",
				button: "group-hover:bg-blue-600",
			},
		},
		{
			title: "Revision & Practice",
			description:
				"Start a focused session to test your knowledge and solidify your learning.",
			Icon: BrainCircuit,
			path: "/revisionSelect",
			style: {
				gradient: "from-purple-500/20 to-neutral-900",
				border: "border-purple-500/30 hover:border-purple-500",
				glow: "group-hover:shadow-purple-500/20",
				button: "group-hover:bg-purple-600",
			},
		},
	];

	return (
		// NEW: Added a subtle grid background pattern
		<div className="min-h-screen bg-neutral-950 text-white bg-grid-pattern">
			<div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950/80 to-neutral-950 flex flex-col justify-center items-center p-4">
				{/* UPGRADED: Hero Section */}
				<div className="text-center mb-16 animate-fade-in-down">
					<h1 className="text-5xl font-extrabold text-white sm:text-6xl md:text-7xl tracking-tight">
						Personal{" "}
						<span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
							Dictionary
						</span>
					</h1>
					<p className="mt-6 max-w-2xl mx-auto text-lg text-neutral-400">
						Your personal space to collect, learn, and master vocabulary. Built
						for lifelong learners.
					</p>
				</div>

				{/* UPGRADED: Action Hub Grid */}
				<div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
					{actionCards.map((card, index) => (
						<div
							key={card.title}
							onClick={() => navigate(card.path)}
							// NEW: Staggered animation for each card
							className="group relative p-6 bg-gradient-to-br rounded-2xl border cursor-pointer transition-all duration-300 hover:-translate-y-2 animate-stagger-in shadow-lg"
							style={{ animationDelay: `${200 + index * 150}ms` }}
						>
							<div
								className={`absolute inset-0 bg-gradient-to-br rounded-2xl border transition-colors ${card.style.gradient} ${card.style.border}`}
							></div>
							<div
								className={`absolute inset-0 rounded-2xl shadow-2xl opacity-0 transition-all duration-300 ${card.style.glow}`}
							></div>

							<div className="relative z-10 flex flex-col h-full text-center">
								<div className="mx-auto mb-6">
									<div className="w-16 h-16 rounded-xl bg-neutral-800/50 border border-neutral-700 flex items-center justify-center">
										<card.Icon className="h-8 w-8 text-neutral-300" />
									</div>
								</div>
								<h3 className="text-xl font-bold text-white mb-3">
									{card.title}
								</h3>
								<p className="text-neutral-400 text-sm flex-grow">
									{card.description}
								</p>
								<div
									className={`mt-8 flex items-center justify-center text-sm font-semibold text-white`}
								>
									<div
										className={`flex items-center gap-2 px-6 py-2.5 rounded-full bg-neutral-700/50 transition-colors duration-300 ${card.style.button}`}
									>
										<span>Get Started</span>
										<ArrowRight size={16} />
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
				<footer className="text-center mt-20 text-neutral-600 text-sm animate-fade-in">
					<p>
						Current Date:{" "}
						{new Date().toLocaleDateString("en-IN", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
					<p>Ahmedabad, Gujarat, India</p>
				</footer>
			</div>
		</div>
	);
};

export default HomePage;
