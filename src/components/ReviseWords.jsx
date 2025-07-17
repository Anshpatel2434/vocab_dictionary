// ReviseWords.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";
import ParaOfWords from "./ParaOfWords";
import HomeButton from "./HomeButton";
import WordCard_Revise from "./WordCard_Revise"; // Import the new card
import { Rocket, X, Flag, Loader2, FileWarning } from "lucide-react"; // Import icons

const ReviseWords = () => {
	// --- All your original state and functions are preserved ---
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	const params = useParams();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const selectedType = searchParams.get("type");
	const currentPage = parseInt(params.page) || 1;
	const [allWords, setAllWords] = useState([]);
	const [limit, setLimit] = useState(20);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [totalWords, setTotalWords] = useState(0);
	const [typeDescription, setTypeDescription] = useState("");
	const [isSessionActive, setIsSessionActive] = useState(false);
	const [clickedWords, setClickedWords] = useState(new Set());
	const [endingSession, setEndingSession] = useState(false);
	const [sessionTransition, setSessionTransition] = useState(false);

	// All your original useEffects and async functions are preserved
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
			const unclickedWords = allWords.filter(
				(word) => !clickedWords.has(word._id)
			);
			const revisionPromises = allWords.map((word) =>
				axios.post(`${BACKEND_URL}/api/v1/increase_revision_count`, {
					id: word._id,
				})
			);
			const decreaseCountPromises = unclickedWords.map((word) =>
				decreaseOpenCount(word._id)
			);
			await Promise.all([...revisionPromises, ...decreaseCountPromises]);
			const clickedCount = clickedWords.size;
			const unclickedCount = unclickedWords.length;
			toast.success(
				`Session completed! ✅ ${clickedCount} words explored, ⬇️ ${unclickedCount} words need more attention.`,
				{ duration: 5000 }
			);
			setSessionTransition(true);
			setTimeout(() => {
				setIsSessionActive(false);
				setClickedWords(new Set());
				setSessionTransition(false);
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
		setClickedWords((prev) => new Set([...prev, word._id]));
		await increaseOpenCount(word._id);
	};
	// --- End of original logic ---

	const progressPercentage =
		allWords.length > 0 ? (clickedWords.size / allWords.length) * 100 : 0;

	if (!selectedType) {
		navigate("/revisionSelect");
		return null;
	}

	return (
		<div className="min-h-screen bg-neutral-950 text-white relative">
			<Toaster
				position="top-center"
				toastOptions={{ style: { background: "#333", color: "#fff" } }}
			/>

			<div
				className={`fixed inset-0 transition-all duration-700 ease-in-out pointer-events-none ${
					isSessionActive || sessionTransition
						? "bg-black/80 backdrop-blur-sm"
						: "bg-transparent"
				}`}
				style={{ zIndex: 1 }}
			/>

			<div className="relative z-10">
				<HomeButton />
				{/* Header Section (Unchanged logic) */}
				<div
					className={`transition-all duration-700 ease-in-out ${
						isSessionActive
							? "opacity-20 pointer-events-none transform scale-95"
							: "opacity-100"
					}`}
				>
					<div className="bg-neutral-900 border-b border-neutral-700 px-6 py-4">
						<div className="max-w-7xl mx-auto">
							<div className="flex items-center justify-between">
								<div>
									<h1 className="text-2xl font-bold text-white mb-1">
										<span className="text-cyan-400">Revision:</span>{" "}
										{selectedType}
									</h1>
									<p className="text-neutral-400 text-sm">{typeDescription}</p>
									<div className="mt-2 text-sm text-neutral-500">
										Total Words: {totalWords} • Page {currentPage} of{" "}
										{totalPages}
									</div>
								</div>
								{!isSessionActive && !sessionTransition && (
									<button
										onClick={startRevision}
										disabled={loading || allWords.length === 0}
										className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-neutral-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/25"
									>
										<Rocket size={18} /> Start Revision Session
									</button>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="relative z-20">
					<ParaOfWords
						allWords={allWords}
						isSessionActive={isSessionActive}
						onWordClick={handleWordClick}
						clickedWords={clickedWords}
					/>
				</div>

				{/* UPGRADED Session Control Panel */}
				{isSessionActive && (
					<div className="fixed top-4 right-4 z-50 bg-neutral-900/80 backdrop-blur-sm border border-neutral-700 rounded-xl p-4 shadow-2xl w-72 animate-fade-in">
						<div className="flex items-center justify-between">
							<div className="text-sm font-medium text-white flex items-center gap-2">
								<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
								Session Active
							</div>
							<button
								onClick={handleEndSession}
								disabled={endingSession}
								className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-neutral-600 text-white text-xs font-bold rounded-lg transition-colors"
							>
								{endingSession ? (
									<Loader2 size={14} className="animate-spin" />
								) : (
									<X size={14} />
								)}
								<span>End</span>
							</button>
						</div>
						<div className="mt-3 w-full bg-neutral-700 rounded-full h-2">
							<div
								className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
								style={{ width: `${progressPercentage}%` }}
							></div>
						</div>
						<p className="text-right text-xs text-neutral-400 mt-1">
							{clickedWords.size} / {allWords.length} words viewed
						</p>
					</div>
				)}

				{/* UPGRADED Words Grid using WordCard_Revise */}
				<div
					className={`transition-all duration-700 ease-in-out ${
						isSessionActive
							? "opacity-20 pointer-events-none transform scale-95"
							: "opacity-100"
					}`}
				>
					{loading ? (
						<div className="flex justify-center items-center h-64">
							<Loader2 size={32} className="animate-spin text-cyan-500" />
						</div>
					) : allWords.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-64 text-neutral-500">
							<FileWarning size={48} className="mb-4" />
							<p>No words found for this category.</p>
						</div>
					) : (
						<div className="max-w-7xl mx-auto px-6 py-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
								{allWords.map((word) => (
									<WordCard_Revise key={word._id} word={word} />
								))}
							</div>
						</div>
					)}
				</div>

				{/* Pagination (Unchanged logic) */}
				{!isSessionActive && !sessionTransition && totalPages > 1 && (
					<div className="transition-all duration-700 ease-in-out">
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					</div>
				)}
			</div>

			{/* Session Transition Overlay (Unchanged logic) */}
			{sessionTransition && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
					<div className="text-center">
						<Loader2
							size={48}
							className="animate-spin text-cyan-500 mx-auto mb-4"
						/>
						<p className="text-white text-lg">
							{isSessionActive ? "Starting Session..." : "Ending Session..."}
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default ReviseWords;
