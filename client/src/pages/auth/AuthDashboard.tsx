import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export const AuthDashboard = () => {
  const [showSignup, setShowSignup] = useState(false);
  return (
    <div className="flex justify-center items-center">
      {showSignup ? (
        <Signup setShowSignup={setShowSignup} />
      ) : (
        <Login setShowSignup={setShowSignup} />
      )}
    </div>
  );
};
