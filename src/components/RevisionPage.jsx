import React, { useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import HomeButton from "./HomeButton";

const RevisionPage = () => {
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	const navigate = useNavigate();

	// Available word types
	const wordTypes = [
		{
			type: "least_revised",
			title: "Least Revised Words",
			description: "Focus on words you haven't practiced much",
			icon: "📚",
			color: "bg-green-600 hover:bg-green-700",
		},
		{
			type: "most_difficult",
			title: "Most Difficult Words",
			description: "Challenge yourself with frequently opened words",
			icon: "🔥",
			color: "bg-red-600 hover:bg-red-700",
		},
		{
			type: "normal",
			title: "Normal Sequence",
			description: "Standard learning progression",
			icon: "📖",
			color: "bg-blue-600 hover:bg-blue-700",
		},
		{
			type: "most_revised",
			title: "Most Revised Words",
			description: "Review your most practiced vocabulary",
			icon: "⭐",
			color: "bg-purple-600 hover:bg-purple-700",
		},
		{
			type: "least_opened",
			title: "Least Opened Words",
			description: "Start with less frequently accessed words",
			icon: "🌱",
			color: "bg-emerald-600 hover:bg-emerald-700",
		},
		{
			type: "newest_first",
			title: "Newest Words",
			description: "Practice your recently added vocabulary",
			icon: "✨",
			color: "bg-cyan-600 hover:bg-cyan-700",
		},
	];

	useEffect(() => {
		verifyLogin();
	}, []);

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
			console.log("Authentication error:", error);
			toast.error(error.response?.data?.message || "Authentication failed");
			navigate("/");
		}
	}

	const handleTypeSelection = (type) => {
		navigate(`/revisionPage/1?type=${type.type}`);
	};

	return (
		<div className="min-h-screen bg-gray-950 text-white">
			<Toaster
				position="top-center"
				toastOptions={{
					duration: 3000,
					style: {
						background: "#333",
						color: "#fff",
						borderRadius: "10px",
					},
				}}
			/>

			{/* Header */}
			<div className="bg-black shadow-md shadow-blue-900/20">
				<HomeButton />
				<div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-white">
								<span className="text-blue-400">Revision</span> Center
							</h1>
							<p className="mt-1 text-gray-400">
								Choose your learning path and start revising
							</p>
						</div>
						<button
							onClick={() => navigate("/dictionary/1")}
							className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
						>
							← Back to Dictionary
						</button>
					</div>
				</div>
			</div>

			{/* Type Selection Grid */}
			<div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8 text-center">
					<h2 className="text-2xl font-bold text-white mb-4">
						Select Your Revision Type
					</h2>
					<p className="text-gray-400 max-w-2xl mx-auto">
						Choose the type of words you want to focus on during your revision
						session. Each type is designed to target different aspects of your
						vocabulary learning.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{wordTypes.map((type) => (
						<div
							key={type.type}
							onClick={() => handleTypeSelection(type)}
							className="bg-gray-900 border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20"
						>
							<div className="text-center">
								<div className="text-4xl mb-4">{type.icon}</div>
								<h3 className="text-xl font-bold text-white mb-2">
									{type.title}
								</h3>
								<p className="text-gray-400 text-sm mb-4">{type.description}</p>
								<div
									className={`inline-block px-4 py-2 ${type.color} text-white font-medium rounded-lg transition-colors duration-200`}
								>
									Select This Type
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default RevisionPage;
