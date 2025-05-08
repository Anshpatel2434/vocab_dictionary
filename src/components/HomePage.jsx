import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-gray-950 text-white flex flex-col">
			{/* Header Section */}
			<div className="bg-black shadow-md shadow-blue-900/20">
				<div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
					<h1 className="text-4xl font-bold text-center">
						<span className="text-blue-400">Personal</span> Dictionary
					</h1>
					<p className="mt-2 text-gray-400 text-center max-w-2xl mx-auto">
						Your private collection of words and meanings to enhance your
						vocabulary
					</p>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-grow flex items-center justify-center px-4 py-12">
				<div className="w-full max-w-3xl mx-auto">
					<div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
						{/* Top Banner */}
						<div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-8 sm:px-10">
							<h2 className="text-2xl font-semibold text-white text-center sm:text-left">
								Welcome to Your Word Journey
							</h2>
							<p className="mt-2 text-blue-200 text-center sm:text-left">
								Choose what you want to do today
							</p>
						</div>

						{/* Options */}
						<div className="p-6 sm:p-10 grid gap-6 md:grid-cols-2">
							{/* Add Words Card */}
							<div className="bg-gray-800 border border-gray-700 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10 hover:border-blue-700/50 group">
								<div className="h-16 w-16 rounded-full bg-blue-900/30 border border-blue-800 flex items-center justify-center mb-6 mx-auto md:mx-0 group-hover:bg-blue-800/40 transition-colors duration-300">
									<svg
										className="w-8 h-8 text-blue-400"
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
								</div>

								<h3 className="text-xl font-semibold text-white mb-3 text-center md:text-left">
									Add New Words
								</h3>
								<p className="text-gray-400 mb-6 text-center md:text-left">
									Expand your vocabulary by adding new words with their
									meanings, pronunciations, and examples.
								</p>

								<button
									onClick={() => navigate("/addWords")}
									className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
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
											d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										></path>
									</svg>
									Add Words
								</button>
							</div>

							{/* Explore Dictionary Card */}
							<div className="bg-gray-800 border border-gray-700 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10 hover:border-blue-700/50 group">
								<div className="h-16 w-16 rounded-full bg-blue-900/30 border border-blue-800 flex items-center justify-center mb-6 mx-auto md:mx-0 group-hover:bg-blue-800/40 transition-colors duration-300">
									<svg
										className="w-8 h-8 text-blue-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
										></path>
									</svg>
								</div>

								<h3 className="text-xl font-semibold text-white mb-3 text-center md:text-left">
									Explore Your Dictionary
								</h3>
								<p className="text-gray-400 mb-6 text-center md:text-left">
									Browse through your personal collection of words, search for
									specific terms, and review their meanings.
								</p>

								<button
									onClick={() => navigate("/dictionary/1")}
									className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
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
									Explore Dictionary
								</button>
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className="mt-8 text-center text-gray-500 text-sm">
						<p>Build your vocabulary one word at a time</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
