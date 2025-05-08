import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Security from "./components/Security";
import HomePage from "./components/HomePage";
import AddWordsPage from "./components/AddWordsPage";
import Dictionary from "./components/Dictionary";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Security />} />
				<Route path="/home" element={<HomePage />} />
				<Route path="/addWords" element={<AddWordsPage />} />
				<Route path="/dictionary/:page" element={<Dictionary />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
