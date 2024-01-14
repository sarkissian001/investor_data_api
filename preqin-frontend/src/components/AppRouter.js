import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import InvestorsTable from './InvestorsTable';
import InvestorAssetDetails from './InvestorAssets';


const isAuthenticated = () => {
  // Check if the user is authenticated (i.e there is a token in local storage)
  const token = localStorage.getItem('access_token');
  return !!token;
};

// validate if the route is autenticated 
const ProtectedRoute = ({ element, ...rest }) => {
  if (isAuthenticated()) {
    return element;
  } else {
    return <Navigate to="/" replace />;
  }
};

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Use the ProtectedRoute for /investors and InvestorAssetDetails data */ }
        <Route
          path="/investors"
          element={<ProtectedRoute element={<InvestorsTable />} />}
        />
        <Route 
        // when clicked on a FirmID redirect to the InvestorAssetDetails page
        path="/investors/:investorId" 
        element={<ProtectedRoute element={<InvestorAssetDetails />} /> }
        />
      </Routes>
    </Router>
  );
}

export default AppRouter;
