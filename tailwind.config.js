module.exports = {
	theme: {
		extend: {
			keyframes: {
				"fade-in": {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"fade-scale-in": {
					// NEW animation
					"0%": { opacity: "0", transform: "scale(0.95) translateX(-50%)" },
					"100%": { opacity: "1", transform: "scale(1) translateX(-50%)" },
				},
			},
			animation: {
				"stagger-in": "fade-in 0.5s ease-out forwards",
				"fade-scale-in": "fade-scale-in 0.2s ease-out forwards", // NEW animation
			},
		},
	},
};
