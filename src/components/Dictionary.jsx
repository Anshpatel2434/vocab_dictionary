// Dictionary.jsx
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Pagination from "./Pagination";
import WordInfo from "./WordInfo"; // We are keeping this!
import WordInfoSkeleton from "./WordInfoSkeleton"; // NEW Skeleton Loader
import HomeButton from "./HomeButton";
import { Plus, Search, XCircle, FileWarning } from "lucide-react";

const Dictionary = () => {
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	const params = useParams();
	const navigate = useNavigate();

	// State management is slightly simplified
	const [words, setWords] = useState([]);
	const [currentPage, setCurrentPage] = useState(parseInt(params.page) || 1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalWords, setTotalWords] = useState(0);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	// NEW: A single, streamlined function for fetching data
	const fetchWordsData = useCallback(
		async (page, search = "") => {
			setLoading(true);
			try {
				// Determines the URL based on whether a search term exists
				const url = search
					? `${BACKEND_URL}/api/v1/words/filter?word=${search}&page=${page}&limit=20`
					: `${BACKEND_URL}/api/v1/getWords?page=${page}&limit=20`;

				const res = await axios.get(url);

				if (res.status === 200) {
					const data = res.data.words ? res.data : res.data; // Handle slightly different response structures
					setWords(data.words);
					setTotalPages(data.totalPages || 1);
					// Only set totalWords when not searching to keep the main count visible
					if (!search) {
						setTotalWords(data.totalCount);
					}
				}
			} catch (error) {
				toast.error("Failed to fetch words.");
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		},
		[BACKEND_URL]
	);

	// A single useEffect to rule them all! It re-runs when page or search term changes.
	useEffect(() => {
		// verifyLogin(); // Your auth check
		fetchWordsData(currentPage, searchTerm);
	}, [currentPage, searchTerm, fetchWordsData]);

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		// When a new search is submitted, reset to page 1
		if (currentPage !== 1) {
			navigate(`/dictionary/1`); // This will trigger the useEffect
		} else {
			// If already on page 1, manually trigger the fetch
			fetchWordsData(1, searchTerm);
		}
		setCurrentPage(1);
	};

	const clearSearch = () => {
		setSearchTerm("");
		// Navigating back to page 1 without a search term will trigger the useEffect to fetch all words
		if (currentPage !== 1) {
			navigate("/dictionary/1");
		} else {
			fetchWordsData(1, "");
		}
		setCurrentPage(1);
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
		navigate(`/dictionary/${page}`);
	};

	return (
		<div className="min-h-screen bg-neutral-950 text-white">
			<Toaster
				position="top-center"
				toastOptions={{ style: { background: "#333", color: "#fff" } }}
			/>

			<div className="absolute top-0 left-0 p-4 z-50">
				<HomeButton />
			</div>

			{/* UPGRADED: Command Center Header */}
			<header className="bg-neutral-900/60 border-b border-neutral-800 sticky top-0 z-40 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						<div className="text-center md:text-left">
							<h1 className="text-3xl font-bold text-white">
								My <span className="text-cyan-400">Dictionary</span>
							</h1>
							<p className="mt-1 text-sm text-neutral-400">
								{!searchTerm
									? `${totalWords} words to master`
									: `Found ${words.length} results`}
							</p>
						</div>
						<div className="w-full md:w-auto flex items-center gap-3">
							<form
								onSubmit={handleSearchSubmit}
								className="relative w-full md:w-64"
							>
								<Search
									size={18}
									className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
								/>
								<input
									type="text"
									placeholder="Search your dictionary..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full pl-10 pr-9 py-2.5 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-200"
								/>
								{searchTerm && (
									<button
										type="button"
										onClick={clearSearch}
										className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-white transition-colors"
									>
										<XCircle size={18} />
									</button>
								)}
							</form>
							<button
								onClick={() => navigate("/addWords")}
								className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors duration-200"
							>
								<Plus size={18} />
								<span className="hidden md:inline">Add Word</span>
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content Area */}
			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{loading ? (
					// UPGRADED: Skeleton Loader
					<div className="space-y-3">
						{Array.from({ length: 10 }).map((_, i) => (
							<WordInfoSkeleton key={i} />
						))}
					</div>
				) : words.length === 0 ? (
					// UPGRADED: Empty State
					<div className="text-center py-20 text-neutral-500">
						<FileWarning size={48} className="mx-auto mb-4" />
						<h2 className="text-xl font-semibold text-white">No Words Found</h2>
						<p className="mt-2 max-w-md mx-auto">
							{searchTerm
								? `Your search for "${searchTerm}" did not return any results. Try a different query or clear the search.`
								: "Your dictionary is empty. Start by adding some new words!"}
						</p>
						{searchTerm && (
							<button
								onClick={clearSearch}
								className="mt-6 px-5 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
							>
								Clear Search
							</button>
						)}
					</div>
				) : (
					// Displaying your WordInfo component
					<div className="space-y-3">
						{words.map((word) => (
							<WordInfo key={word._id} wordInfo={word} />
						))}
					</div>
				)}

				{/* Pagination */}
				{!loading && totalPages > 1 && (
					<div className="mt-12">
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					</div>
				)}
			</main>
		</div>
	);
};

export default Dictionary;
