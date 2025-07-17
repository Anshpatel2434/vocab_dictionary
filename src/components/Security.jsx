// Security.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Lock, KeyRound, ArrowRight, Loader2 } from "lucide-react"; // Import new icons

const Security = () => {
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// --- Your original logic is preserved ---
	useEffect(() => {
		// Attempt to log in with a stored token on initial load
		if (localStorage.getItem("vocabToken")) {
			sendRequest(true);
		}
	}, []);

	async function sendRequest(isInitialAttempt = false) {
		setIsLoading(true);
		try {
			const token = password || localStorage.getItem("vocabToken");
			if (!token) {
				if (!isInitialAttempt) toast.error("Password cannot be empty.");
				return; // Exit if no password or token is available
			}

			const res = await axios.post(`${BACKEND_URL}/api/v1/verifyPassword`, {
				password: token,
			});

			if (res.status === 200) {
				if (!isInitialAttempt) toast.success(res.data.message);
				localStorage.setItem("vocabToken", res.data.token);
				setTimeout(() => navigate("/home"), 500);
			}
		} catch (error) {
			console.error("Authentication error:", error);
			if (!isInitialAttempt) {
				toast.error(error.response?.data?.message || "Authentication failed");
			}
			// Clear a potentially invalid token
			localStorage.removeItem("vocabToken");
		} finally {
			setIsLoading(false);
		}
	}

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			sendRequest();
		}
	};
	// --- End of original logic ---

	return (
		<div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
			{/* Animated Gradient Background */}
			<div className="absolute inset-0 z-0">
				<div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
				<div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
			</div>

			<Toaster
				position="top-center"
				toastOptions={{ style: { background: "#333", color: "#fff" } }}
			/>

			<div className="relative z-10 text-center w-full max-w-md">
				{/* UPGRADED: Hero Section */}
				<div className="mb-10 animate-fade-in-down">
					<h1 className="text-5xl font-extrabold text-white tracking-tight">
						Welcome Back
					</h1>
					<p className="mt-4 text-lg text-neutral-400">
						Enter your access key to unlock your personal dictionary.
					</p>
				</div>

				{/* UPGRADED: Glassmorphism Login Card */}
				<div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-8 animate-fade-in">
					<div className="flex items-center gap-3 mb-6">
						<Lock className="text-cyan-400" />
						<h2 className="text-xl font-bold text-white">Secure Access</h2>
					</div>

					<div className="space-y-6">
						<div className="relative">
							<KeyRound
								size={20}
								className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
							/>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="Your Access Key"
								className="w-full pl-12 pr-4 py-3 rounded-lg bg-neutral-800/60 border border-neutral-700 text-white placeholder-neutral-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-200"
								autoFocus
							/>
						</div>

						<button
							onClick={() => sendRequest()}
							disabled={isLoading}
							className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-opacity duration-200 flex items-center justify-center gap-2 text-lg"
						>
							{isLoading ? (
								<Loader2 className="animate-spin" />
							) : (
								<ArrowRight />
							)}
							<span>{isLoading ? "Verifying..." : "Unlock"}</span>
						</button>
					</div>
				</div>

				<footer className="text-center mt-12 text-neutral-600 text-sm animate-fade-in">
					<p>
						© {new Date().getFullYear()} Personal Dictionary. All rights
						reserved.
					</p>
				</footer>
			</div>
		</div>
	);
};

export default Security;
