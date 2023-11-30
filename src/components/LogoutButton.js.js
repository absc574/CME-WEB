import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  return (
    <div>
        {isAuthenticated && (
             <button onClick={() => logout({ returnTo: window.location.origin })} className="btn btn-primary">
             Log Out
             </button>
        )}
    </div>
  );
};

export default LogoutButton;
