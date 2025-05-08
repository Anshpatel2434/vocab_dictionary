import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Pagination from "./Pagination";
import WordInfo from "./WordInfo";

const Dictionary = () => {
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	const params = useParams();
	const navigate = useNavigate();

	const [allWords, setAllWords] = useState([]);
	const [filteredWords, setFilteredWords] = useState([]);
	const [currentPage, setCurrentPage] = useState(params.page || 1);
	const [limit, setLimit] = useState(20);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [totalWords, setTotalWords] = useState(0);

	useEffect(() => {
		fetchWords();
	}, [params]);

	useEffect(() => {
		verifyLogin();
	}, []);

	async function verifyLogin() {
		try {
			const res = await axios.post(`${BACKEND_URL}/api/v1/verifyPassword`, {
				password: localStorage.getItem("vocabToken"),
			});

			if (res.status === 200) {
			} else {
				toast.error(res.data.message);
				navigate("/");
			}
		} catch (error) {
			console.log("In error of the sendRequest in security : ", error);
			toast.error(error.response?.data?.message || "Authentication failed");
			navigate("/");
		}
	}

	async function fetchWords() {
		setLoading(true);
		try {
			const res = await axios.get(
				`${BACKEND_URL}/api/v1/getWords?page=${currentPage}&limit=${limit}`
			);
			console.log("got the response and the data is : ", res.data.words);
			if (res.status === 200) {
				setAllWords(res.data.words);
				setFilteredWords(res.data.words);
				setTotalPages(res.data.totalPages);
				setTotalWords(res.data.totalCount);
			}
		} catch (error) {
			console.log("Error in fetching words in dictionary : ", error);
			toast.error(error.response?.data?.message || "Failed to fetch words");
		}
		setLoading(false);
	}

	async function fetchFilteredWords() {
		setLoading(true);
		try {
			const res = await axios.get(
				`${BACKEND_URL}/api/v1/words/filter?word=${searchTerm}`
			);
			console.log(
				"got the response in filter and the data is : ",
				res.data.words
			);
			if (res.status === 200) {
				setFilteredWords(res.data.words);
				setTotalPages(res.data.totalPages);
			}
		} catch (error) {
			console.log("Error in fetching words in dictionary in filter : ", error);
			toast.error(
				error.response?.data?.message || "Failed to fetch words in filter"
			);
		}
		setLoading(false);
	}

	const handleSearchSubmit = () => {
		if (searchTerm.trim() !== "") {
			fetchFilteredWords();
		}
	};

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
		navigate(`/dictionary/${page}`);
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

			{/* Header Section */}
			<div className="bg-black shadow-md shadow-blue-900/20">
				<div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between">
						<div className="mb-4 md:mb-0">
							<h1 className="text-3xl font-bold text-white">
								<span className="text-blue-400">My</span> Dictionary{" "}
								<span className=" text-2xl ml-14 text-slate-300">
									(Total Words : {totalWords})
								</span>
							</h1>
							<p className="mt-1 text-gray-400">
								Expand your vocabulary one word at a time
							</p>
						</div>

						<div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
							{/* Add Words Button */}
							<a
								href="/addWords"
								className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 mb-3 md:mb-0"
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									></path>
								</svg>
								Add New Words
							</a>

							{/* Search Bar */}
							<div className="w-full md:w-auto md:min-w-[300px]">
								<div className="relative">
									<input
										type="text"
										placeholder="Search words..."
										value={searchTerm}
										onChange={handleSearch}
										onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
										className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 pr-24"
									/>
									<button
										onClick={handleSearchSubmit}
										className="absolute inset-y-0 right-0 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-r-lg px-3 transition-colors duration-200 border-l border-blue-700"
										aria-label="Search"
									>
										<svg
											className="w-5 h-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
											></path>
										</svg>
										<span>Search</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
				{loading ? (
					<div className="flex justify-center items-center h-64">
						<div className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-black shadow-sm">
							<svg
								className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-400"
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
							Loading words...
						</div>
					</div>
				) : (
					<>
						{searchTerm !== "" &&
							(filteredWords.length === 0 ? (
								<div className="text-center py-16">
									<div className="text-5xl mb-4 text-gray-600">🔍</div>
									<h3 className="text-xl font-medium text-gray-300">
										No words found
									</h3>
									<p className="mt-2 text-gray-500">
										Try adjusting your search or browse all words by clearing
										the search field.
									</p>
									{searchTerm !== "" && (
										<button
											className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
											onClick={() => {
												setSearchTerm("");
												window.location.reload();
											}}
										>
											Clear Search
										</button>
									)}
								</div>
							) : (
								<div className="space-y-4">
									{filteredWords.map((item, index) => (
										<WordInfo key={item._id || index} wordInfo={item} />
									))}
									<button
										className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
										onClick={() => {
											setSearchTerm("");
											window.location.reload();
										}}
									>
										Clear Search
									</button>
								</div>
							))}

						{searchTerm === "" && (
							<div className="space-y-4">
								{allWords.map((item, index) => (
									<WordInfo key={item._id || index} wordInfo={item} />
								))}
							</div>
						)}

						{/* Only show pagination when not searching */}
						{!searchTerm && (
							<div className="mt-8">
								<Pagination
									currentPage={parseInt(currentPage)}
									totalPages={totalPages}
									onPageChange={handlePageChange}
								/>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default Dictionary;
