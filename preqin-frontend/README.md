# Preqin Investor Dashboard

This React Single Page Application (SPA) interfaces with the Preqin API to display a list of investors in a table format. It allows users to navigate through investor details and view commitment information based on different asset classes.

## Features

1. **Investors Table:** Displays a list of investors with details such as FirmId, FirmName, Type, DateAdded, and Address.
2. **Navigation to Investor Details:** Clicking on a row in the table navigates to a detailed page for the investor.
3. **Investor Details Page:** Shows a dropdown to select AssetClasses (e.g., PE, PD, RE, INF, NR, HF).
4. **Commitment Information:** Displays commitment information for a selected AssetClass and investor.

## Installation

To get started with the app, clone the repository and install the dependencies.

```bash
git clone https://github.com/sarkissian001/investor_data_api.git
cd preqin-frontend
npm install
```

# Running the Application

To run the application in the development mode, use:

```bash
npm start
```
This runs the app in development mode and should automatically open http://localhost:3000 in your browser.

## Usage

- **View Investors:** Navigate to the home page to view a table of investors.
- **Investor Details:** Click on an investor row to view more details.
- **Select AssetClass:** In the investor details page, select an AssetClass from the dropdown to view commitment information.

## Environment Variables

Set the following environment variables in your `.env` file:

- `REACT_APP_API_URL`: URL to the Preqin API.
- `REACT_APP_FIRM_IDS`: Comma-separated firm IDs to fetch (e.g., 2670, 2792, 332, 3611).

