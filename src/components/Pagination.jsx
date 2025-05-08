import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	// Generate array of page numbers to display
	const getPageNumbers = () => {
		const pageNumbers = [];
		const maxPagesToShow = 5; // Adjust based on design preference

		if (totalPages <= maxPagesToShow) {
			// Show all pages if total is less than max to show
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(i);
			}
		} else {
			// Always include first page
			pageNumbers.push(1);

			// Calculate start and end of page range
			let startPage = Math.max(2, currentPage - 1);
			let endPage = Math.min(totalPages - 1, currentPage + 1);

			// Adjust range if at edges
			if (currentPage <= 2) {
				endPage = 4;
			} else if (currentPage >= totalPages - 1) {
				startPage = totalPages - 3;
			}

			// Add ellipsis after first page if needed
			if (startPage > 2) {
				pageNumbers.push("...");
			}

			// Add page numbers in range
			for (let i = startPage; i <= endPage; i++) {
				pageNumbers.push(i);
			}

			// Add ellipsis before last page if needed
			if (endPage < totalPages - 1) {
				pageNumbers.push("...");
			}

			// Always include last page
			pageNumbers.push(totalPages);
		}

		return pageNumbers;
	};

	const pageNumbers = getPageNumbers();

	return (
		<nav className="flex justify-center">
			<ul className="flex items-center space-x-1">
				{/* Previous button */}
				<li>
					<button
						onClick={() => onPageChange(Math.max(1, currentPage - 1))}
						disabled={currentPage === 1}
						className={`px-3 py-2 rounded-md ${
							currentPage === 1
								? "text-gray-500 cursor-not-allowed"
								: "text-blue-400 hover:bg-gray-900 hover:text-blue-300"
						} transition-colors`}
						aria-label="Previous page"
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
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
				</li>

				{/* Page numbers */}
				{pageNumbers.map((number, index) => (
					<li key={index}>
						{number === "..." ? (
							<span className="px-3 py-2 text-gray-500">...</span>
						) : (
							<button
								onClick={() => onPageChange(number)}
								className={`w-10 h-10 rounded-md flex items-center justify-center ${
									currentPage === number
										? "bg-blue-600 text-white"
										: "text-gray-300 hover:bg-gray-800 hover:text-white"
								} transition-colors`}
								aria-current={currentPage === number ? "page" : undefined}
							>
								{number}
							</button>
						)}
					</li>
				))}

				{/* Next button */}
				<li>
					<button
						onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
						disabled={currentPage === totalPages}
						className={`px-3 py-2 rounded-md ${
							currentPage === totalPages
								? "text-gray-500 cursor-not-allowed"
								: "text-blue-400 hover:bg-gray-900 hover:text-blue-300"
						} transition-colors`}
						aria-label="Next page"
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
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				</li>
			</ul>
		</nav>
	);
};

export default Pagination;
