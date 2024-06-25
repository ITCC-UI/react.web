// DynamicPieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DynamicPieChart = ({ data, legendPosition, legendFontSize, legendTitle, chartWidth = 200 }) => {
  if (!data || !data.labels || data.labels.length === 0) {
    return <div>No data available</div>;
  }
const config={
  type: 'doughnut',
  data: 'data'
}
  const options = {
    plugins: {
      legend: {
        display: false,
        position: legendPosition || 'bottom',
        title: {
          display: false
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((acc, current) => acc + current, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${percentage}% (${value})`;
          },
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    cutout: '70%',
  };

  return (
    <div style={{ 
      width: 'fit-content', 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center", 
      margin: '0 auto',
      
      padding: '20px',
    }}>
      <div style={{
        width: `${chartWidth}px`,
        height: `${chartWidth}px`,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1
        }}>
          20/40
        </div>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default DynamicPieChart;