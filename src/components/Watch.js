import React from 'react';
import Player from './Player';
import { useAuth0 } from "@auth0/auth0-react";

const Watch = () => {

    const {isAuthenticated } = useAuth0();

  return (
    <div>
        {isAuthenticated && (
          <div className="videoPlayer">
          </div>
        )}
    </div>
  )
}

export default Watch
