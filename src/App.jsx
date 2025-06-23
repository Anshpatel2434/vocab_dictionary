import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Security from "./components/Security";
import HomePage from "./components/HomePage";
import AddWordsPage from "./components/AddWordsPage";
import Dictionary from "./components/Dictionary";
import RevisionPage from "./components/RevisionPage";
import ReviseWords from "./components/ReviseWords";
import RevisionSession from "./components/RevisionSession";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Security />} />
				<Route path="/home" element={<HomePage />} />
				<Route path="/addWords" element={<AddWordsPage />} />
				<Route path="/dictionary/:page" element={<Dictionary />} />
				<Route path="/revisionSelect" element={<RevisionPage />} />
				<Route path="/revisionPage/:page" element={<ReviseWords />} />
				<Route path="/revisionSession" element={<RevisionSession />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
