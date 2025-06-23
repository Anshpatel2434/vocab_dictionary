import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import ParaOfWords from "./ParaOfWords";
import WordPopup from "./WordPopup";

const RevisionSession = () => {
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	const navigate = useNavigate();
	const location = useLocation();

	// Get data from navigation state
	const { allWords, selectedType, typeDescription, totalWords } =
		location.state || {};

	// Revision tracking
	const [clickedWords, setClickedWords] = useState(new Set());
	const [selectedWordForPopup, setSelectedWordForPopup] = useState(null);
	const [showPopup, setShowPopup] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		verifyLogin();

		// If no words data, redirect back to selection
		if (!allWords || allWords.length === 0) {
			toast.error("No words data found. Please select a revision type first.");
			navigate("/revisionSelect");
		}
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

	async function increaseOpenCount(wordId) {
		try {
			await axios.post(`${BACKEND_URL}/api/v1/increase_open_count`, {
				id: wordId,
			});
		} catch (error) {
			console.log("Error increasing open count:", error);
		}
	}

	async function handleEndSession() {
		setLoading(true);
		try {
			// Increase revision count for all words
			const revisionPromises = allWords.map((word) =>
				axios.post(`${BACKEND_URL}/api/v1/increase_revision_count`, {
					id: word._id,
				})
			);

			await Promise.all(revisionPromises);

			toast.success(
				`Session completed! Revised ${allWords.length} words. Clicked on ${clickedWords.size} words for details.`
			);

			// Go back to word selection
			navigate("/revisionSelect");
		} catch (error) {
			console.log("Error ending session:", error);
			toast.error("Failed to save session progress");
		}
		setLoading(false);
	}

	const handleWordClick = async (word) => {
		// Track clicked word
		setClickedWords((prev) => new Set([...prev, word._id]));

		// Increase open count
		await increaseOpenCount(word._id);

		// Show popup
		setSelectedWordForPopup(word);
		setShowPopup(true);
	};

	const closePopup = () => {
		setShowPopup(false);
		setSelectedWordForPopup(null);
	};

	// If no words data, show loading or redirect
	if (!allWords || allWords.length === 0) {
		return (
			<div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin h-8 w-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
					<p className="text-gray-400">Loading revision session...</p>
				</div>
			</div>
		);
	}

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
				<div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between">
						<div className="mb-4 md:mb-0">
							<h1 className="text-3xl font-bold text-white">
								<span className="text-green-400">Active</span> Revision Session
								<span className="text-2xl ml-4 text-slate-300">
									({totalWords} words)
								</span>
							</h1>
							<p className="mt-1 text-gray-400">
								Click on highlighted words to view details • {clickedWords.size}{" "}
								words viewed
							</p>
						</div>

						<button
							onClick={handleEndSession}
							disabled={loading}
							className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
						>
							{loading ? (
								<>
									<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
											fill="none"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
									Ending Session...
								</>
							) : (
								<>🏁 End Session</>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* ParaOfWords Component */}
			<ParaOfWords allWords={allWords} />

			{/* Clickable Words List */}
			<div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
				<div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
					<h2 className="text-2xl font-bold text-white mb-4">
						📝 Word List - Click to View Details
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
						{allWords.map((word, index) => (
							<button
								key={word._id || index}
								onClick={() => handleWordClick(word)}
								className={`p-3 rounded-lg font-medium transition-all duration-200 ${
									clickedWords.has(word._id)
										? "bg-green-600 text-white shadow-lg shadow-green-500/20"
										: "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/20"
								}`}
							>
								{word.word}
								{clickedWords.has(word._id) && <span className="ml-2">✓</span>}
							</button>
						))}
					</div>

					<div className="mt-4 text-sm text-gray-400 text-center">
						Progress: {clickedWords.size} / {allWords.length} words viewed
					</div>
				</div>
			</div>

			{/* Word Details Popup */}
			<WordPopup
				word={selectedWordForPopup}
				isOpen={showPopup}
				onClose={closePopup}
			/>
		</div>
	);
};

export default RevisionSession;
