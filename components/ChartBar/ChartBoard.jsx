// Pie.js
import React, { useState, useEffect } from 'react';
import DynamicPieChart from './DynamicPie';
import './Pie.scss';

const ChartBoard = () => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://random-data-api.com/api/v2/users?size=2');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const users = await response.json();

      // Count users by subscription plan
      const planCounts = users.reduce((acc, user) => {
        acc[user.subscription.plan] = (acc[user.subscription.plan] || 0) + 1;
        return acc;
      }, {});

      // Format data for Chart.js
    //   Declaring the data stuffs here
      const formattedData = {
        labels: Object.keys(planCounts),
        datasets: [{
          data: Object.values(planCounts),
          borderColor: ['transparent', 'transparent'],
          backgroundColor: [
            'rgba(0, 0, 128, 1)', 'rgba(250, 166, 44, 1)',
          ],
        }],
      };

      setChartData(formattedData);
    } catch (error) {
      setError(<button onClick={fetchData}>Refresh</button>);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className='loading'>Loading your data</div>;
  if (error) return <div>{error}</div>;



return (
    <div className='donutContainer'>
      {chartData && (
        <DynamicPieChart
          data={chartData}
        //   legendTitle="Student Days Duration"
          chartWidth={150} // Set your desired chart width here
        />
      )}
      {/* <button onClick={fetchData}>Refresh Data</button> */}
    </div>
  );
  
};

export default ChartBoard;