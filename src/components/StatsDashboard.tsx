import { Beer } from '../types/beer';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
}

function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
      <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
      {description && (
        <dd className="mt-2 text-sm text-gray-500">{description}</dd>
      )}
    </div>
  );
}

interface StatsDashboardProps {
  beers: Beer[];
  division: string;
}

export function StatsDashboard({ beers, division }: StatsDashboardProps) {
  const stats = {
    totalBeers: beers.length,
    readyBeers: beers.filter(beer => beer.status === 'Ready').length,
    inProgressBeers: beers.filter(beer => beer.status !== 'Ready').length,
    averageABV: beers.reduce((sum, beer) => sum + beer.abv, 0) / beers.length || 0,
    totalVolume: beers.reduce((sum, beer) => sum + beer.batchSize, 0),
    averageProductionDays: Math.round(
      beers.reduce((sum, beer) => {
        const days = Math.ceil(
          (new Date().getTime() - beer.brewDate.getTime()) / (1000 * 3600 * 24)
        );
        return sum + days;
      }, 0) / beers.length || 0
    ),
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {division} Statistics
      </h3>
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard 
          title="Total Beers" 
          value={stats.totalBeers} 
        />
        <StatsCard 
          title="Ready to Serve" 
          value={stats.readyBeers}
        />
        <StatsCard 
          title="In Progress" 
          value={stats.inProgressBeers}
        />
        <StatsCard 
          title="Average ABV" 
          value={`${stats.averageABV.toFixed(1)}%`}
        />
        <StatsCard 
          title="Total Volume" 
          value={`${stats.totalVolume}L`}
        />
        <StatsCard 
          title="Avg. Production Time" 
          value={`${stats.averageProductionDays} days`}
        />
      </dl>
    </div>
  );
}