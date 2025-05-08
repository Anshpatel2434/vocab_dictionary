import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Security = () => {
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		sendRequest(true);
	}, []);

	async function sendRequest(first = false) {
		console.log("The first is : ", first);
		console.log("The item is : ", localStorage.getItem("vocabToken"));

		setIsLoading(true);
		try {
			const res = await axios.post(`${BACKEND_URL}/api/v1/verifyPassword`, {
				password: password || localStorage.getItem("vocabToken"),
			});

			if (res.status === 200) {
				toast.success(res.data.message);
				localStorage.setItem("vocabToken", res.data.token);
				setTimeout(() => {
					navigate("/home");
				}, 1000);
			} else {
				if (!first) toast.error(res.data.message);
			}
		} catch (error) {
			console.log("In error of the sendRequest in security : ", error);
			if (!first)
				toast.error(error.response?.data?.message || "Authentication failed");
		} finally {
			setIsLoading(false);
		}
	}

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			sendRequest(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-950 text-white flex flex-col">
			<Toaster
				position="top-center"
				toastOptions={{
					duration: 3000,
					style: {
						background: "#333",
						color: "#fff",
						borderRadius: "10px",
					},
					success: {
						iconTheme: {
							primary: "#3b82f6",
							secondary: "#fff",
						},
					},
					error: {
						iconTheme: {
							primary: "#ef4444",
							secondary: "#fff",
						},
					},
				}}
			/>

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
				<div className="w-full max-w-md mx-auto">
					<div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
						{/* Top Banner */}
						<div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-8 sm:px-10">
							<h2 className="text-2xl font-semibold text-white text-center">
								Welcome Back
							</h2>
							<p className="mt-2 text-blue-200 text-center">
								Enter your password to continue
							</p>
						</div>

						{/* Form Content */}
						<div className="p-6 sm:p-10">
							<div className="space-y-6">
								<div className="relative">
									<input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										onKeyDown={handleKeyDown}
										placeholder="Enter password"
										className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-200"
										autoFocus
									/>
								</div>

								<button
									onClick={() => sendRequest(false)}
									disabled={isLoading}
									className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
								>
									{isLoading ? (
										<svg
											className="animate-spin h-5 w-5 mr-2 text-white"
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
									) : (
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
												d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
											></path>
										</svg>
									)}
									<span className="ml-2">
										{isLoading ? "Verifying..." : "Study Now"}
									</span>
								</button>

								<div className="pt-4 border-t border-gray-800">
									<button
										onClick={() => navigate("/home")}
										className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
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
												d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
											></path>
										</svg>
										<span className="ml-2">Go to HomePage</span>
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className="mt-8 text-center text-gray-500 text-sm">
						<p>© {new Date().getFullYear()} Personal Dictionary</p>
						<p className="mt-1">Build your vocabulary one word at a time</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Security;
