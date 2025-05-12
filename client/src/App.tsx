import "./App.css";
import { SnackBar } from "./components/ui/Snackbar";
import { useAppSelector } from "./hooks/app.hooks";
import { AuthDashboard } from "./pages/auth/AuthDashboard";
import { Dashboard } from "./pages/dashboard/Dashboard";

function App() {
  const { isAuthenticated } = useAppSelector((store) => store.auth);
  const { isSnackbarOpen, snackbarMessage, snackbarSeverity, showTime } =
    useAppSelector((store) => store.common);
  return (
    <div className="relative w-screen h-screen bg-[#FFF9F9]">
      {isAuthenticated ? <Dashboard /> : <AuthDashboard />}
      {isSnackbarOpen && (
        <SnackBar
          type={snackbarSeverity}
          message={snackbarMessage}
          showTime={showTime}
        />
      )}
    </div>
  );
}

export default App;
