import { useQuery } from '@tanstack/react-query';
import { RecordApi } from '@/api/RecordApi';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card';

export const KpiCards = ({ modelName }) => {
  // Fetch the KPI data using React Query
  const kpiQuery = useQuery({
    queryKey: ['records', 'kpis', modelName],
    queryFn: async () => RecordApi.kpis(modelName).then(({ data }) => data),
  });

  if (kpiQuery.isLoading) return <div>Loading KPI data...</div>;
  if (kpiQuery.isError) return <div>Error fetching KPI data</div>;

  const {
    totalRecords,
    recordsThisYear,
    recordsThisMonth,
    // recordsThisWeek,
    lastRecordCreated,
    yearChange,
    monthChange,
    // weekChange,
  } = kpiQuery.data;

  // Helper function to format the change value
  const formatChange = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return value > 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
  };

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Records</CardDescription>
          <CardTitle className="text-4xl">{totalRecords}</CardTitle>
        </CardHeader>
        <CardContent>{/* No change data for total records */}</CardContent>
      </Card>
      {/* <Card>
        <CardHeader className="pb-2">
          <CardDescription>This Week</CardDescription>
          <CardTitle className="text-4xl">{recordsThisWeek}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-xs">
            {formatChange(weekChange)} from last week
          </div>
        </CardContent>
      </Card> */}
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>This Month</CardDescription>
          <CardTitle className="text-4xl">{recordsThisMonth}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-xs">
            {formatChange(monthChange)} from last month
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>This Year</CardDescription>
          <CardTitle className="text-4xl">{recordsThisYear}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-xs">
            {formatChange(yearChange)} from last year
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Last Record Created At</CardDescription>
          <CardTitle className="text-4xl">
            {lastRecordCreated
              ? new Intl.DateTimeFormat('en-US', {
                  month: 'short', // Abbreviated month (e.g., "Sep")
                  day: '2-digit', // Day with leading zero if needed
                }).format(new Date(lastRecordCreated))
              : 'N/A'}
          </CardTitle>
        </CardHeader>
        <CardContent>{/* Optional additional content */}</CardContent>
      </Card>
    </div>
  );
};
