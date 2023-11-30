import React from "react";
import "../App.css";

import {
  faYoutube,
  faFacebook,
  faTwitter,
  faInstagram
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
      <div className="footer">
            <div className="container">
            <div className="row">
                <div className="col-md-8">
                  <p>MGTV.tv | FAQs </p>
                  </div>
                  <div className="col-md-4">

                      <a href="https://www.youtube.com/@matlalagroup5414"
                        className="youtube social">
                        <FontAwesomeIcon icon={faYoutube}  />
                      </a>
                      <a href="https://www.facebook.com/profile.php?id=100063940508026"
                        className="facebook social">
                        <FontAwesomeIcon icon={faFacebook}  />
                      </a>
                      <a href="https://www.instagram.com/matlala_group/"
                        className="instagram social">
                        <FontAwesomeIcon icon={faInstagram}/>
                      </a>

                  </div>
                </div>
            </div>
      </div>
  );
}

export default Footer;
