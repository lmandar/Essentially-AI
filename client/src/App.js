import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
	const [symbol, setSymbol] = useState('');
	const [fromDate, setFromDate] = useState('');
	const [stockData, setStockData] = useState({});
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);


	const handleSymbolChange = (e) => {
		// Store the user's input in the state as is (in lowercase)
		setSymbol(e.target.value.toUpperCase());
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate that the symbol and date fields are not empty
		if (!symbol || !fromDate) {
			setError('Please enter both the stock symbol and date.');
			setStockData({}); // Clear stock data
			return;
		}

		setIsLoading(true);

		try {
			const response = await axios.post('http://localhost:5000/api/fetchStockData', {
				symbol,
				fromDate,
			});

			setStockData(response.data.data || {});
			setError(null);
		} catch (error) {
			// console.log("error",error.response.data.message)
			setError(error.response.data.message);
			setStockData({}); // Clear stock data
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container">
			<h1>Essentially AI</h1>
			<form onSubmit={handleSubmit} className="form">
				<input
					type="text"
					placeholder="Stock Symbol"
					value={symbol}
					onChange={handleSymbolChange} // Use the custom handler for symbol input
					className="input"
				/>
				<input
					type="date"
					value={fromDate}
					onChange={(e) => setFromDate(e.target.value)}
					className="input"
				/>
				<button type="submit" className="button" disabled={isLoading}>
					{isLoading ? 'Fetching...' : 'Fetch Stock Data'}
				</button>
			</form>
			{error && <p className="error">{error}</p>}
			{/* Only display stock data when there's no error */}
			{!error && Object.keys(stockData).length > 0 && (
				<div>
					<h2>Stock Data</h2>
					<p>Open: {stockData.open}</p>
					<p>High: {stockData.high}</p>
					<p>Low: {stockData.low}</p>
					<p>Close: {stockData.close}</p>
					<p>Volume: {stockData.volume}</p>
				</div>
			)}
		</div>
	);
};

export default App;
