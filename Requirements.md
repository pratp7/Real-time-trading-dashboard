The assessment is a hands-on frontend engineering challenge where you'll build a real-time cryptocurrency data dashboard using React and TypeScript. You'll work with a provided mock Node.js backend that serves both REST API and WebSocket data. All requirements and backend details are in the document linked below.
📎 Assessment Document: Below Pasted
⏳ Deadline: Please submit your completed solution within 2 business days of receiving this email.
📦 How to submit: Create a public GitHub repository containing your solution and reply to this email with the repository link.
Your repository should include:
Complete source code in TypeScript with progressive commit history
A clear README.md with project overview, setup instructions, assumptions, and bonus feature notes
Instructions for running your application locally
A few tips before you start:
Read the entire document carefully, including the backend README, before writing any code
We value clean TypeScript usage, proper React patterns, and responsive design
Client-side data caching and efficient WebSocket management are important
Show your thought process through progressive commits — please avoid submitting everything in a single commit
Document any assumptions or trade-offs in your README
Bonus features are optional but appreciated if time allows




[Frontend / Fullstack] Coding Challenge: Real-Time Trading Dashboard
Objective
Design and implement a real-time trading dashboard that displays live ticker prices and interactive charts for selected financial instruments.
Scope
1. Backend Service (Java/NodeJS/Go)
   
●	Build a microservice that:
○	Simulates or connects to a mock market data feed (e.g., WebSocket or polling)
○	Streams real-time price updates for a set of tickers (e.g., AAPL, TSLA, BTC-USD)
○	Exposes a RESTful API to:
■	List available tickers
■	Fetch historical price data (mocked)
■	Subscribe to real-time updates via WebSocket
3. Frontend Dashboard (React + TypeScript)
   
●	Create a dashboard UI that:
○	Displays a list of tickers with live price updates
○	Shows a real-time chart for a selected ticker (e.g., using Chart.js or Recharts)
○	Allows users to switch between tickers
○	Includes basic styling and responsiveness
4. Architecture & Design

●	Use a microservices-friendly structure
●	Apply clean code principles and separation of concerns
●	Include basic unit tests for backend logic
●	Use Docker for containerization
Bonus Features (Optional)

●	Add user authentication (mocked)
●	Implement caching for historical data
●	Add alerting for price thresholds
●	Deploy using Kubernetes manifests
Evaluation Criteria

●	Code quality and structure
●	Real-time data handling
●	API and WebSocket implementation
●	UI responsiveness and interactivity
●	Test coverage and documentation
●	Bonus features and overall polish
Submission Details

Please submit your solution via a GitHub repository link. The repository should include:
●	A clear README.md file with:
○	Project overview
○	Any assumptions or trade-offs made
○	Instructions for running tests
○	Notes on bonus features (if implemented)
