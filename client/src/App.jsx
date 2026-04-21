import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const location = useLocation();

  // Hide Navbar and Footer on admin pages
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && <Navbar />}
      <main className="flex-1">
        <AppRoutes />
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
};

export default App;
