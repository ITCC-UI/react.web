// Pie.js
import React, { useState, useEffect } from 'react';
import DynamicPieChart from './DynamicPie';
// import './Pie.scss';

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
      const formattedData = {
        labels: Object.keys(planCounts),
        datasets: [{
          data: Object.values(planCounts),
          backgroundColor: [
            'orange', 'pink',
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

// Pie.js
// ... (rest of the code remains the same)

return (
    <div>
      {chartData && (
        <DynamicPieChart
          data={chartData}
          legendPosition="bottom"
        
          legendFontSize={14}
        //   legendTitle="Subscription Plan Distribution"
          chartWidth={200} // Set your desired chart width here
        />
      )}
      <button onClick={fetchData}>Refresh Data</button>
    </div>
  );
  
  // ... (rest of the code remains the same)
};

export default ChartBoard;