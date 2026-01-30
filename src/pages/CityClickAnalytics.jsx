import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function CityClickAnalytics() {
  const [stats, setStats] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: 100,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/rentals/city-click-stats?${params}`
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setTotal(data.total);
        toast.success("Statistics loaded successfully");
      } else {
        toast.error("Failed to load statistics");
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Error fetching statistics");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/rentals/export-city-clicks?${params}`
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `city-clicks-${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        toast.success("CSV downloaded successfully");
      } else {
        toast.error("Failed to export CSV");
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error("Error exporting CSV");
    }
  };

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <TrendingUp className="h-8 w-8" />
            City Click Analytics
          </h1>
          <p className="text-muted-foreground">
            Track and analyze city clicks across your platform
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="text-muted-foreground text-sm mb-1">Total Clicks</div>
            <div className="text-3xl font-bold text-foreground">{total}</div>
          </Card>

          <Card className="p-6">
            <div className="text-muted-foreground text-sm mb-1">Cities Tracked</div>
            <div className="text-3xl font-bold text-foreground">{stats.length}</div>
          </Card>

          <Card className="p-6">
            <div className="text-muted-foreground text-sm mb-1">Avg Clicks/City</div>
            <div className="text-3xl font-bold text-foreground">
              {stats.length > 0 ? Math.round(total / stats.length) : 0}
            </div>
          </Card>
        </div>

        {/* Date Range Filter */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">From Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, startDate: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg bg-background"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">To Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg bg-background"
              />
            </div>

            <Button
              onClick={exportCSV}
              className="bg-accent hover:bg-accent/90 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </Card>

        {/* City Statistics Table */}
        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading statistics...
            </div>
          ) : stats.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No click data available for the selected date range
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Rank</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">City</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">Clicks</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((stat, index) => (
                    <tr
                      key={stat.city}
                      className="border-b hover:bg-secondary/50 transition"
                    >
                      <td className="px-6 py-4 text-sm font-semibold">{index + 1}</td>
                      <td className="px-6 py-4 text-sm">{stat.city}</td>
                      <td className="px-6 py-4 text-sm text-right font-semibold">
                        {stat.clicks}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-muted-foreground">
                        {((stat.clicks / total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Chart Section (Optional Enhancement) */}
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Top 10 Cities by Clicks</h2>
          <div className="space-y-3">
            {stats.slice(0, 10).map((stat) => (
              <div key={stat.city} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium">{stat.city}</div>
                <div className="flex-1">
                  <div className="h-6 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{
                        width: `${(stat.clicks / (stats[0]?.clicks || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right text-sm font-semibold">
                  {stat.clicks}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
