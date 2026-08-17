import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./routes";

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="app-shell">
      {!isAdmin && <Navbar />}
      <main className="app-main">
        <AppRoutes />
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}
