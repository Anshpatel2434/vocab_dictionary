import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";
import ParaOfWords from "./ParaOfWords";
import WordPopup from "./WordPopup";
import HomeButton, { CompactHomeButton } from "./HomeButton";

const ReviseWords = () => {
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	const params = useParams();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const selectedType = searchParams.get("type");
	const currentPage = parseInt(params.page) || 1;

	// Words data
	const [allWords, setAllWords] = useState([]);
	const [limit, setLimit] = useState(20);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [totalWords, setTotalWords] = useState(0);
	const [typeDescription, setTypeDescription] = useState("");

	// Revision session state
	const [isSessionActive, setIsSessionActive] = useState(false);
	const [clickedWords, setClickedWords] = useState(new Set());
	const [selectedWordForPopup, setSelectedWordForPopup] = useState(null);
	const [showPopup, setShowPopup] = useState(false);
	const [endingSession, setEndingSession] = useState(false);
	const [sessionTransition, setSessionTransition] = useState(false);

	useEffect(() => {
		verifyLogin();
	}, []);

	useEffect(() => {
		if (selectedType) {
			fetchWordsByType();
		}
	}, [selectedType, currentPage]);

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

	async function fetchWordsByType() {
		setLoading(true);
		try {
			const res = await axios.get(
				`${BACKEND_URL}/api/v1/getWordsByType?type=${selectedType}&page=${currentPage}&limit=${limit}`
			);

			if (res.status === 200) {
				setAllWords(res.data.data.words);
				setTotalPages(res.data.data.totalPages);
				setTotalWords(res.data.data.totalCount);
				setTypeDescription(res.data.data.description);
			}
		} catch (error) {
			console.log("Error fetching words:", error);
			toast.error(error.response?.data?.message || "Failed to fetch words");
		}
		setLoading(false);
	}

	const handlePageChange = (page) => {
		if (isSessionActive) {
			toast.error("Please end the current session before navigating");
			return;
		}
		navigate(`/revisionPage/${page}?type=${selectedType}`);
	};

	const startRevision = () => {
		if (allWords.length === 0) {
			toast.error("No words available for revision");
			return;
		}

		setSessionTransition(true);

		setTimeout(() => {
			setIsSessionActive(true);
			setClickedWords(new Set());
			setSessionTransition(false);
			toast.success(`Revision session started with ${allWords.length} words!`, {
				icon: "🚀",
				style: {
					background: "#065f46",
					color: "#fff",
				},
			});
		}, 500);
	};

	async function increaseOpenCount(wordId) {
		try {
			await axios.post(`${BACKEND_URL}/api/v1/increase_open_count`, {
				id: wordId,
			});
		} catch (error) {
			console.log("Error increasing open count:", error);
		}
	}

	async function decreaseOpenCount(wordId) {
		try {
			await axios.post(`${BACKEND_URL}/api/v1/decrease_open_count`, {
				id: wordId,
			});
		} catch (error) {
			console.log("Error decreasing open count:", error);
		}
	}

	async function handleEndSession() {
		setEndingSession(true);
		try {
			// Get words that were NOT clicked during the session
			const unclickedWords = allWords.filter(
				(word) => !clickedWords.has(word._id)
			);

			// Increase revision count for all words
			const revisionPromises = allWords.map((word) =>
				axios.post(`${BACKEND_URL}/api/v1/increase_revision_count`, {
					id: word._id,
				})
			);

			// Decrease open count for unclicked words
			const decreaseCountPromises = unclickedWords.map((word) =>
				decreaseOpenCount(word._id)
			);

			await Promise.all([...revisionPromises, ...decreaseCountPromises]);

			const clickedCount = clickedWords.size;
			const unclickedCount = unclickedWords.length;

			toast.success(
				`Session completed! ✅ ${clickedCount} words explored, ⬇️ ${unclickedCount} words need more attention.`,
				{
					duration: 5000,
					style: {
						background: "#065f46",
						color: "#fff",
					},
				}
			);

			// Start session end transition
			setSessionTransition(true);

			setTimeout(() => {
				// Reset session state
				setIsSessionActive(false);
				setClickedWords(new Set());
				setShowPopup(false);
				setSelectedWordForPopup(null);
				setSessionTransition(false);

				// Refresh the words data to show updated counts
				fetchWordsByType();
			}, 1000);
		} catch (error) {
			console.log("Error ending session:", error);
			toast.error("Failed to save session progress");
		}
		setEndingSession(false);
	}

	const handleWordClick = async (word, event) => {
		if (!isSessionActive) return;

		// Track clicked word
		setClickedWords((prev) => new Set([...prev, word._id]));

		// Increase open count
		await increaseOpenCount(word._id);
	};

	if (!selectedType) {
		toast.error("No revision type selected");
		navigate("/revisionSelect");
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
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

			{/* Dynamic overlay for session mode with smooth transitions */}
			<div
				className={`fixed inset-0 transition-all duration-1000 ease-in-out pointer-events-none ${
					isSessionActive || sessionTransition
						? "bg-black bg-opacity-80 backdrop-blur-lg"
						: "bg-transparent"
				}`}
				style={{ zIndex: isSessionActive ? 1 : -1 }}
			/>

			{/* Header Section */}
			<div
				className={`relative z-10 transition-all duration-1000 ease-in-out ${
					isSessionActive
						? "opacity-20 pointer-events-none transform scale-95"
						: "opacity-100"
				}`}
			>
				<HomeButton />
				<div className="bg-gray-900 border-b border-gray-700 px-6 py-4">
					<div className="max-w-6xl mx-auto">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-bold text-white mb-1">
									<span className="text-blue-400">Revision:</span>{" "}
									{selectedType}
								</h1>
								<p className="text-gray-400 text-sm">{typeDescription}</p>
								<div className="mt-2 text-sm text-gray-500">
									Total Words: {totalWords} • Page {currentPage} of {totalPages}
								</div>
							</div>

							{!isSessionActive && !sessionTransition && (
								<button
									onClick={startRevision}
									disabled={loading || allWords.length === 0}
									className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/25"
								>
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
										/>
									</svg>
									Start Revision Session
								</button>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* ParaOfWords Component - Always visible, handles its own session state */}
			<div className="relative z-20">
				<ParaOfWords
					allWords={allWords}
					isSessionActive={isSessionActive}
					onWordClick={handleWordClick}
					clickedWords={clickedWords}
				/>
			</div>

			{/* Main Content Area */}
			<div className="relative z-50">
				{/* Session Control Panel - Only visible during active session */}
				{isSessionActive && (
					<div className="fixed top-4 right-4 z-50 bg-gray-900 border border-gray-600 rounded-lg p-4 shadow-2xl animate-fade-in">
						<div className="flex items-center gap-4">
							<div className="text-sm text-gray-300">
								<div className="flex items-center gap-2 mb-1">
									<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
									<span className="font-medium">Session Active</span>
								</div>
								<div className="text-xs text-gray-400">
									Progress: {clickedWords.size} / {allWords.length} words
								</div>
							</div>

							<button
								onClick={handleEndSession}
								disabled={endingSession}
								className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200"
							>
								{endingSession ? (
									<>
										<svg
											className="animate-spin w-4 h-4"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Ending...
									</>
								) : (
									<>
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
										End Session
									</>
								)}
							</button>
						</div>
					</div>
				)}

				{/* Words Grid - Dimmed during session */}
				<div
					className={`transition-all duration-1000 ease-in-out ${
						isSessionActive
							? "opacity-20 pointer-events-none transform scale-95"
							: "opacity-100"
					}`}
				>
					{loading ? (
						<div className="flex justify-center items-center h-64">
							<div className="flex items-center gap-3">
								<svg
									className="animate-spin h-8 w-8 text-blue-500"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								<span className="text-lg text-gray-300">Loading words...</span>
							</div>
						</div>
					) : allWords.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-64 text-gray-400">
							<svg
								className="w-16 h-16 mb-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							<p className="text-lg">No words found for this type</p>
							<p className="text-sm mt-2">Try selecting a different category</p>
						</div>
					) : (
						<div className="max-w-6xl mx-auto px-6 py-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
								{allWords.map((word, index) => (
									<div
										key={word._id || index}
										className={`bg-gray-800 border border-gray-600 rounded-lg p-4 hover:border-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 ${
											clickedWords.has(word._id)
												? "ring-2 ring-green-500 bg-green-900/20"
												: ""
										}`}
									>
										<div className="flex justify-between items-start mb-2">
											<h3 className="text-lg font-semibold text-white truncate">
												{word.word}
											</h3>
											<div className="flex gap-1">
												{word.no_of_times_opened === 0 && (
													<span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
														New
													</span>
												)}
												{word.no_of_times_opened <= 2 &&
													word.no_of_times_opened > 0 && (
														<span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
															Learning
														</span>
													)}
												{word.no_of_times_opened > 2 && (
													<span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
														Known
													</span>
												)}
											</div>
										</div>

										<p className="text-gray-400 text-sm mb-2">
											{word.pronunciation && `/${word.pronunciation}/`}
										</p>

										<p className="text-gray-300 text-sm mb-3 line-clamp-2">
											{word.meaning?.[0]?.meaning || "No meaning available"}
										</p>

										<div className="flex justify-between items-center text-xs text-gray-500">
											<span>Opened: {word.no_of_times_opened || 0}</span>
											<span>Revised: {word.no_of_times_revised || 0}</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Pagination - Hidden during session */}
				{!isSessionActive && !sessionTransition && totalPages > 1 && (
					<div className="transition-all duration-1000 ease-in-out">
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					</div>
				)}
			</div>

			{/* Loading overlay for session transitions */}
			{sessionTransition && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
						<p className="text-white text-lg">
							{isSessionActive ? "Starting Session..." : "Ending Session..."}
						</p>
					</div>
				</div>
			)}

			{/* Custom styles for animations */}
			<style jsx>{`
				@keyframes fade-in {
					from {
						opacity: 0;
						transform: translateY(-10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fade-in {
					animation: fade-in 0.3s ease-out;
				}

				.line-clamp-2 {
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
			`}</style>
		</div>
	);
};

export default ReviseWords;
