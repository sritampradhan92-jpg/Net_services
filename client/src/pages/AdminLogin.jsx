import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import Alert from "../components/Alert";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [mode, setMode] = useState("signin");
  const [hasAdmin, setHasAdmin] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchSetupStatus = async () => {
      try {
        const res = await API.get("/api/admin/setup-status");
        const adminExists = !!res.data?.hasAdmin;
        setHasAdmin(adminExists);
        if (adminExists) {
          setMode("signin");
        }
      } catch {
        // Keep signin mode as safe default if setup status fetch fails
        setMode("signin");
      }
    };

    fetchSetupStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!formData.email || !formData.password) {
      setAlert({ type: "error", message: "Please enter email and password." });
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        await API.post("/api/admin/signup", formData);
        setAlert({
          type: "success",
          message: "Admin account created successfully. Please sign in now.",
        });
        setMode("signin");
      } else {
        const res = await API.post("/api/admin/login", formData);
        login(res.data.token);
        navigate("/admin/dashboard");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        (mode === "signup" ? "Signup failed. Please try again." : "Login failed. Please try again.");
      setAlert({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === "signup" ? "Admin Signup" : "Admin Login"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === "signup"
              ? "Create the only admin account (one-time setup)."
              : "Sign in to access the admin dashboard."}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          {alert && (
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white font-semibold py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (mode === "signup" ? "Creating..." : "Signing In...") : mode === "signup" ? "Create Admin" : "Sign In"}
            </button>

            {!hasAdmin && (
              <button
                type="button"
                onClick={() => {
                  setMode((prev) => (prev === "signup" ? "signin" : "signup"));
                  setAlert(null);
                }}
                className="w-full text-primary-600 font-medium py-2 rounded-lg hover:bg-primary-50 transition-colors"
              >
                {mode === "signup" ? "Already have admin account? Sign In" : "First time setup? Create Admin"}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
