import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import backendURL from '../utilities/urls';

function InvestorsTable() {
  const [investorData, setInvestorData] = useState([]);

  useEffect(() => {
    const fetchInvestorData = async (accessToken) => {
      // Check if investorData is cached in localStorage
      const cachedInvestorData = localStorage.getItem('investorData');

      if (cachedInvestorData) {
        setInvestorData(JSON.parse(cachedInvestorData));
      } else {
        const firmIds = process.env.REACT_APP_FIRM_IDS.split(',');
        const investorDataArray = [];

        for (const firmId of firmIds) {
          try {
            const response = await axios.get(`${backendURL}/api/Investor?FirmID=${firmId}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            // Check if response data is empty or undefined, and provide a default value
            const data = response.data.data[0] || {
              firmID: firmId,
              firmName: 'Unknown',
              firmType: 'Unknown',
              yearEst: 'Unknown',
              address: 'Unknown',
            };

            investorDataArray.push(data);
          } catch (error) {
            console.error(`Failed to fetch data for firm ID ${firmId}`, error);
            // If there's an error, push an object with the firm ID and "Unknown" values
            investorDataArray.push({
              firmID: firmId,
              firmName: 'Unknown',
              firmType: 'Unknown',
              yearEst: 'Unknown',
              address: 'Unknown',
            });
          }
        }

        // Store investorData in localStorage for caching
        localStorage.setItem('investorData', JSON.stringify(investorDataArray));
        setInvestorData(investorDataArray);
      }
    };

    const accessToken = localStorage.getItem('access_token');
    fetchInvestorData(accessToken);
  }, []);

  return (
    <div>
      <h2>Investors</h2>
      {investorData && investorData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>FirmId</th>
              <th>FirmName</th>
              <th>Type</th>
              <th>DateAdded</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {investorData.map((data, index) => (
              <tr key={index}>
                <td>
                  <Link to={`/investors/${data.firmID}`}>{data.firmID || 'Unknown'}</Link>
                </td>
                <td>{data.firmName || 'Unknown'}</td>
                <td>{data.firmType || 'Unknown'}</td>
                <td>{data.yearEst || 'Unknown'}</td>
                <td>{data.address || 'Unknown'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No investor data available.</p>
      )}
    </div>
  );
}

export default InvestorsTable;
