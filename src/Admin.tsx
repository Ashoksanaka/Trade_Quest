import { useState } from "react";
import { Users, Lock, RotateCcw } from "lucide-react";

interface AdminProps {
  onReset: () => void;
  currentCount: number;
}

function Admin({ onReset, currentCount }: AdminProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  // Admin password - Change this to your desired password
  const ADMIN_PASSWORD = "Ashok@1#8$0_5"; // Change this password!

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
      setPassword("");
    } else {
      setError("Incorrect password. Access denied.");
      setPassword("");
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the registration count to 0?")) {
      onReset();
      alert("Registration count has been reset to 0.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-slate-700/50 p-6 sm:p-8 rounded-lg border border-slate-600">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold">Admin Access</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Enter Admin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Password"
                required
                autoFocus
              />
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white py-12 sm:py-16 md:py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-700/50 p-6 sm:p-8 rounded-lg border border-slate-600">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Admin Panel</h1>
          
          <div className="space-y-6">
            {/* Current Count Display */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-emerald-400">
                    {currentCount.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-300 mt-1">
                    Current Registration Count
                  </div>
                </div>
              </div>
            </div>

            {/* Reset Section */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-red-400 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                Reset Registration Count
              </h2>
              <p className="text-slate-300 mb-3 sm:mb-4 text-xs sm:text-sm">
                This will reset the registration count to 0. This action cannot be undone.
              </p>
              <button
                onClick={handleReset}
                className="w-full bg-red-500 hover:bg-red-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                Reset Count to 0
              </button>
            </div>

            {/* Logout */}
            <div className="pt-4 border-t border-slate-600">
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPassword("");
                }}
                className="w-full text-slate-400 hover:text-slate-300 text-sm underline"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
