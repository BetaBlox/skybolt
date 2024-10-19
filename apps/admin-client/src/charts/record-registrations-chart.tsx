import { Line } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query';
import { RecordApi } from '@/api/RecordApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { captilalize } from '@repo/utils';
import { Card, CardContent } from '@/components/card';

// Register the required elements with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface Props {
  modelName: string;
}
export const RecordRegistrationsChart = ({ modelName }: Props) => {
  const registrationsQuery = useQuery({
    queryKey: ['records', 'registrations', modelName],
    queryFn: async () =>
      RecordApi.registrations(modelName).then(({ data }) => data),
  });

  // If data is loading or there's an error
  if (registrationsQuery.isLoading) return <div>Loading...</div>;
  if (registrationsQuery.isError) return <div>Error fetching data</div>;

  // Process data for the chart
  const chartData = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        label: `${captilalize(modelName)}`,
        data: registrationsQuery.data,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(0,0,0,0.5)',
        pointBackgroundColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        fill: false, // Ensures that the area under the line is not filled
        tension: 0.3, // This adds a slight curve to the line
      },
    ],
  };

  // Chart options with white background
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        enabled: false, // Hide the tooltip
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)', // Light grid lines on x-axis
        },
        ticks: {
          color: '#000', // Black labels
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)', // Light grid lines on y-axis
        },
        ticks: {
          color: '#000', // Black labels
        },
      },
    },
    layout: {
      padding: 10, // Adjusts padding around the chart
    },
  };

  return (
    <Card>
      <CardContent>
        <div
          style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};
