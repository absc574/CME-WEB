import React from "react";
import { useAuth0 } from "@auth0/auth0-react";


const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated} = useAuth0();

  return (
        <div>
          {!isAuthenticated && (
            <div className='signInButton'>
              <button onClick={() => loginWithRedirect()}  className="btn btn-primary btn-login navbar-btn" >Log In</button>
            </div>
          )}
        </div>
  );
};

export default LoginButton;
