import React from 'react';
import backgroundVideo from '../assets/Site-banner.mp4';
import logo from '../assets/matlala-icon.png';
import LoginButton from './LoginButton';
import "../App.css";
import { useAuth0 } from "@auth0/auth0-react";



const Background = () => {

  const {isAuthenticated } = useAuth0();

  return (
        <div className="main-page" >
            {!isAuthenticated && (
            <div className="main-page">
                  <nav className="navbar navbar-inverse">
                    <div className="container">
                      <div className="navbar-header">
                          <img src={logo} className="logo" alt="" />
                      </div>
                      <LoginButton />
                    </div>
                  </nav>

                  <div className="main-page-bg">
                  </div>
                  <div className="main-page_sub">
                        <div className="container">
                            <div className="row">
                              <div className="col-md-3 ">
                                  <div className="thumbnail1"></div>
                              </div>
                              <div className="col-md-3 ">
                                  <div className="thumbnail2"></div>
                              </div>
                              <div className="col-md-3 ">
                                  <div className="thumbnail3"></div>
                              </div>
                              <div className="col-md-3 ">
                                <div className="thumbnail4"></div>
                              </div>
                        </div>
                    </div>
                  </div>

            </div>
            )}
        </div>

  )
}

export default Background
