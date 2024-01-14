import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import backendURL from '../utilities/urls';

function InvestorAssetDetails() {
  const { investorId } = useParams();
  const [commitmentData, setCommitmentData] = useState([]);
  const [selectedAssetClass, setSelectedAssetClass] = useState('PE');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(200);

  useEffect(() => {
    // using useEffect hook to call this functions everytime the selection changes
    const fetchCommitmentData = async () => {
      // Function to get investor commitment data based on specified asset class
      try {
        setLoading(true); // indicate that data fetching is in progress. 
        const access_token = localStorage.getItem('access_token');
        const page = currentPage;
        const size = itemsPerPage;
    
        const response = await axios.get(
          `${backendURL}/api/Investor/commitment/${selectedAssetClass.toLocaleLowerCase()}/${investorId}?Page=${page}&Size=${size}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        
        if (Array.isArray(response.data.data)) {
          setCommitmentData(response.data.data);
        } else {
          console.error('Invalid Commitment data', response.data);
          setCommitmentData([]);
        }
      } catch (error) {
        console.error('Failed to fetch commitment data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommitmentData();
  }, [selectedAssetClass, investorId, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCommitmentData = commitmentData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <h2>Investor Page</h2>
      <p>Investor ID: {investorId}</p>

      <select
        value={selectedAssetClass}
        onChange={(e) => setSelectedAssetClass(e.target.value)}
      >
        <option value="PE">PE (Private Equity)</option>
        <option value="PD">PD (Private Debt)</option>
        <option value="RE">RE (Real Estate)</option>
        <option value="INF">INF (Infrastructure)</option>
        <option value="NR">NR (Natural Resources)</option>
        <option value="HF">HF (Hedge Funds)</option>
      </select>

      {loading ? (
        <p>Loading commitment data...</p>
      ) : (
        <div>
          <h3>Commitment Data</h3>
          <pre>{JSON.stringify(currentCommitmentData, null, 2)}</pre>
        </div>
      )}

      <div>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous Page
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentCommitmentData.length < itemsPerPage}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}

export default InvestorAssetDetails;

