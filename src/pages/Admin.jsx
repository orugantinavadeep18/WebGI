import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, BarChart3, MessageCircle, Home, Settings, Trash2, Edit, Eye,
  Search, Filter, Download, LogOut, ArrowLeft
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { apiCall } from "@/lib/api";

export default function Admin() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Data states
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalMessages: 0,
  });
  const [allUsers, setAllUsers] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [conversations, setConversations] = useState([]);

  // Admin authentication check
  useEffect(() => {
    if (!user || user.email !== "kittu8441@gmail.com") {
      toast.error("Unauthorized: Admin access only");
      navigate("/");
      return;
    }
    fetchAdminData();
  }, [user, navigate]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch all users
      const usersRes = await apiCall("/auth/all-users", {
        method: "GET",
      }).catch(() => ({ users: [] }));
      setAllUsers(usersRes.users || []);

      // Fetch all properties
      const propsRes = await apiCall("/properties", {
        method: "GET",
      });
      setAllProperties(propsRes.properties || []);

      // Update stats
      setStats({
        totalUsers: usersRes.users?.length || 0,
        totalProperties: propsRes.properties?.length || 0,
        totalBookings: propsRes.properties?.reduce(
          (sum, p) => sum + (p.totalBookings || 0),
          0
        ) || 0,
        totalMessages: 0,
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await apiCall(`/auth/users/${userId}`, { method: "DELETE" });
      toast.success("User deleted");
      fetchAdminData();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const deleteProperty = async (propertyId) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      await apiCall(`/properties/${propertyId}`, { method: "DELETE" });
      toast.success("Property deleted");
      fetchAdminData();
    } catch (error) {
      toast.error("Failed to delete property");
    }
  };

  const filteredUsers = allUsers.filter(
    (u) =>
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProperties = allProperties.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition inline-flex items-center gap-2 text-gray-700 mb-4"
              title="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>
        </div>

        {/* Header with Logout */}
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Settings className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-gray-600 text-sm">System Administration Panel</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  signOut();
                  navigate("/");
                }}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 mt-2">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-6 shadow border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                </div>
                <Users className="h-12 w-12 text-blue-300" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Properties</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.totalProperties}
                  </p>
                </div>
                <Home className="h-12 w-12 text-green-300" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Bookings</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats.totalBookings}
                  </p>
                </div>
                <BarChart3 className="h-12 w-12 text-purple-300" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Conversations</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {stats.totalMessages}
                  </p>
                </div>
                <MessageCircle className="h-12 w-12 text-orange-300" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="flex flex-wrap border-b">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-4 font-medium border-b-2 transition ${
                  activeTab === "overview"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`px-6 py-4 font-medium border-b-2 transition ${
                  activeTab === "users"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Users ({allUsers.length})
              </button>
              <button
                onClick={() => setActiveTab("properties")}
                className={`px-6 py-4 font-medium border-b-2 transition ${
                  activeTab === "properties"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Properties ({allProperties.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">System Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                      <h3 className="font-bold mb-2">👥 User Management</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Total registered users: {allUsers.length}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("users")}
                      >
                        Manage Users
                      </Button>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                      <h3 className="font-bold mb-2">🏠 Property Management</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Total properties: {allProperties.length}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("properties")}
                      >
                        Manage Properties
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === "users" && (
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left p-3">Name</th>
                          <th className="text-left p-3">Email</th>
                          <th className="text-left p-3">Joined</th>
                          <th className="text-left p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u) => (
                          <tr key={u._id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{u.name || "N/A"}</td>
                            <td className="p-3">{u.email}</td>
                            <td className="p-3 text-xs text-gray-600">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toast.info(`User ID: ${u._id}`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteUser(u._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Properties Tab */}
              {activeTab === "properties" && (
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Search properties by title or city..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left p-3">Title</th>
                          <th className="text-left p-3">Owner</th>
                          <th className="text-left p-3">Owner Email</th>
                          <th className="text-left p-3">City</th>
                          <th className="text-left p-3">Price</th>
                          <th className="text-left p-3">Type</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-left p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProperties.map((p) => {
                          // Find owner from allUsers
                          const owner = allUsers.find(u => u._id === p.seller);
                          return (
                            <tr key={p._id} className="border-b hover:bg-gray-50">
                              <td className="p-3 font-medium truncate max-w-xs">
                                {p.title}
                              </td>
                              <td className="p-3">{owner?.name || "Unknown"}</td>
                              <td className="p-3 text-blue-600">{owner?.email || "N/A"}</td>
                              <td className="p-3">{p.city}</td>
                              <td className="p-3 font-bold">₹{p.price?.toLocaleString()}</td>
                              <td className="p-3 capitalize">{p.propertyType}</td>
                              <td className="p-3">
                                <Badge
                                  className={
                                    p.status === "available"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }
                                >
                                  {p.status}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      navigate(`/properties/${p._id}`)
                                    }
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteProperty(p._id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
