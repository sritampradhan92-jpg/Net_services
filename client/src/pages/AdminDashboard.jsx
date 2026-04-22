import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [requestCalls, setRequestCalls] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeSection, setActiveSection] = useState("requestCalls");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      const [registrationsRes, requestCallsRes, contactsRes] = await Promise.allSettled([
        API.get("/api/admin/registrations"),
        API.get("/api/admin/request-calls"),
        API.get("/api/admin/contacts"),
      ]);

      const hasUnauthorizedError = [registrationsRes, requestCallsRes, contactsRes].some(
        (result) => result.status === "rejected" && result.reason?.response?.status === 401
      );

      if (hasUnauthorizedError) {
        logout();
        navigate("/admin");
        return;
      }

      const nextRegistrations =
        registrationsRes.status === "fulfilled" ? registrationsRes.value.data?.data || [] : [];
      const nextRequestCalls =
        requestCallsRes.status === "fulfilled" ? requestCallsRes.value.data?.data || [] : [];
      const nextContacts =
        contactsRes.status === "fulfilled" ? contactsRes.value.data?.data || [] : [];

      setRegistrations(nextRegistrations);
      setRequestCalls(nextRequestCalls);
      setContacts(nextContacts);

      const failedCount = [registrationsRes, requestCallsRes, contactsRes].filter(
        (result) => result.status === "rejected"
      ).length;

      if (failedCount === 3) {
        setAlert({ type: "error", message: "Failed to fetch dashboard data." });
      } else if (failedCount > 0) {
        setAlert({
          type: "error",
          message: "Some dashboard sections could not be loaded right now. Please refresh.",
        });
      } else {
        setAlert(null);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate("/admin");
        return;
      }
      setAlert({ type: "error", message: "Failed to fetch dashboard data." });
    } finally {
      setLoading(false);
    }
  }, [logout, navigate]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await API.patch(`/api/admin/update-status/${id}`, { status: newStatus });
      setRegistrations((prev) =>
        prev.map((reg) => (reg._id === id ? { ...reg, status: newStatus } : reg))
      );
      setAlert({ type: "success", message: "Status updated successfully." });
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate("/admin");
        return;
      }
      setAlert({ type: "error", message: "Failed to update status." });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) return;

    try {
      await API.delete(`/api/admin/delete/${id}`);
      setRegistrations((prev) => prev.filter((reg) => reg._id !== id));
      setAlert({ type: "success", message: "Registration deleted successfully." });
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate("/admin");
        return;
      }
      setAlert({ type: "error", message: "Failed to delete registration." });
    }
  };

  const handleDeleteRequestCall = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request call?")) return;

    try {
      await API.delete(`/api/admin/request-calls/${id}`);
      setRequestCalls((prev) => prev.filter((call) => call._id !== id));
      setAlert({ type: "success", message: "Request call deleted successfully." });
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate("/admin");
        return;
      }
      setAlert({ type: "error", message: "Failed to delete request call." });
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact message?")) return;

    try {
      await API.delete(`/api/admin/contacts/${id}`);
      setContacts((prev) => prev.filter((contact) => contact._id !== id));
      setAlert({ type: "success", message: "Contact message deleted successfully." });
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate("/admin");
        return;
      }
      setAlert({ type: "error", message: "Failed to delete contact message." });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  const statusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const normalizedQuery = searchTerm.trim().toLowerCase();
  const filteredRegistrations = registrations.filter((reg) => {
    if (!normalizedQuery) return true;
    return (
      reg.name?.toLowerCase().includes(normalizedQuery) ||
      reg.phone?.toLowerCase().includes(normalizedQuery) ||
      reg.email?.toLowerCase().includes(normalizedQuery) ||
      reg.service?.toLowerCase().includes(normalizedQuery) ||
      reg.status?.toLowerCase().includes(normalizedQuery)
    );
  });

  const filteredRequestCalls = requestCalls.filter((call) => {
    if (!normalizedQuery) return true;
    return (
      call.name?.toLowerCase().includes(normalizedQuery) ||
      call.phone?.toLowerCase().includes(normalizedQuery)
    );
  });

  const filteredContacts = contacts.filter((contact) => {
    if (!normalizedQuery) return true;
    return (
      contact.name?.toLowerCase().includes(normalizedQuery) ||
      contact.phone?.toLowerCase().includes(normalizedQuery) ||
      contact.message?.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">Netcom Digital Service Center</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {alert && (
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        )}

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <label htmlFor="admin-search" className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            id="admin-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone, email, service or status"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          />
        </div>

        {/* Section Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setActiveSection("requestCalls")}
            className={`rounded-xl p-5 shadow-sm border text-left transition-colors ${
              activeSection === "requestCalls"
                ? "bg-indigo-50 border-indigo-300"
                : "bg-white border-gray-100 hover:bg-gray-50"
            }`}
          >
            <p className="text-2xl font-bold text-indigo-600">{requestCalls.length}</p>
            <p className="text-sm text-gray-600">Request Calls</p>
          </button>

          <button
            onClick={() => setActiveSection("contacts")}
            className={`rounded-xl p-5 shadow-sm border text-left transition-colors ${
              activeSection === "contacts"
                ? "bg-teal-50 border-teal-300"
                : "bg-white border-gray-100 hover:bg-gray-50"
            }`}
          >
            <p className="text-2xl font-bold text-teal-600">{contacts.length}</p>
            <p className="text-sm text-gray-600">Contact Messages</p>
          </button>

          <button
            onClick={() => setActiveSection("registrations")}
            className={`rounded-xl p-5 shadow-sm border text-left transition-colors ${
              activeSection === "registrations"
                ? "bg-primary-50 border-primary-300"
                : "bg-white border-gray-100 hover:bg-gray-50"
            }`}
          >
            <p className="text-2xl font-bold text-gray-900">{registrations.length}</p>
            <p className="text-sm text-gray-600">Registrations</p>
          </button>
        </div>

        {activeSection === "requestCalls" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Request Calls</h2>
            <button
              onClick={fetchRegistrations}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : filteredRequestCalls.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">No request calls found for current search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRequestCalls.map((call) => (
                    <tr key={call._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{call.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{call.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(call.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteRequestCall(call._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}

        {activeSection === "contacts" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Contact Messages</h2>
            <button
              onClick={fetchRegistrations}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : filteredContacts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">No contact messages found for current search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Message</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredContacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{contact.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{contact.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell max-w-[280px] truncate">{contact.message}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteContact(contact._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}

        {activeSection === "registrations" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Registrations</h2>
            <button
              onClick={fetchRegistrations}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : filteredRegistrations.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">No registrations found for current search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Email
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Message
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Date
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {reg.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {reg.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap hidden md:table-cell">
                        {reg.email || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {reg.service}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell max-w-[200px] truncate">
                        {reg.message || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={reg.status}
                          onChange={(e) => handleUpdateStatus(reg._id, e.target.value)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer ${statusColor(reg.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap hidden md:table-cell">
                        {new Date(reg.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(reg._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
