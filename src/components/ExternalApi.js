import { useAuth0 } from '@auth0/auth0-react';
import React,{useState, useEffect} from 'react';
import "../App.css";
import ReactHlsPlayer from 'react-hls-player';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import defaultVID from '../assets/default_vd_img.jfif';




let token = "";

const ExternalApi = () => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const { getAccessTokenSilently, isAuthenticated} = useAuth0();
  const [video, setVideo] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setModalId("");
  const handleShow = () => setShow(true);

  const [modalId, setModalId] = React.useState("");
//console.log("setModalId", setModalId);


  const callSecureApi = async () => {

    try {
      token = await getAccessTokenSilently();
     //console.log('tokenenenenen',token);
      //this.props.token = token;
      //console.log("this.props);

      const response = await fetch(
        `${serverUrl}/api/content`,
        {
          headers: {
            Authorization: `Bearer ${token}`,


          },
        },

      );

      if (response.ok) {
        const data = await response.json();

        // since the icon urls require authentication we can't use them directly
        // in an <img>, so we fetch them all here
        for (const item of data) {
          item.icon = await fetch(item.icon, {
            method: 'GET',
            mode: 'cors',
            headers: {
            'Content-Type' :'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => res.blob())
            .then((blob) => URL.createObjectURL(blob))
            .catch((e) => console.log("e.message", e.message));
        }
        ///////////////////// called it here/////////////////
        setVideo(data)
        console.log('Information about data'+data)
      }


    } catch (e) {
      console.log(e);
      return {};
    }
  //  return token;

  }

  useEffect(() => {
    callSecureApi()
  },[]);


  return (
    <div>

      {isAuthenticated && (
        <div className="container">
          {/*<button type="button" className="btn btn-primary" onClick={callSecureApi}>Content</button>*/}
          <div className="row videos_list">
          {video.map((vid, i)=>{
            return <div key={vid.id} className="col-md-4">

                {
                    (() => {
                        if(vid.icon !==undefined) {
                                return (
                                      <div>
                                      <img src={vid.icon} className="img-thumbnail thumbs" onClick={() => setModalId(`modal${i}`)}/>
                                      <h4>{vid.name} </h4>

                                          <Modal size="lg" show={modalId === `modal${i}`} onHide={handleClose}>

                                            <Modal.Header closeButton>
                                              <Modal.Title>{vid.name}</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                            <ReactHlsPlayer
                                            src={vid.playlist}
                                            hlsConfig={{
                                                maxLoadingDelay: 4,
                                                minAutoBitrate: 0,
                                                lowLatencyMode: true,
                                                autoStartLoad: true,
                                                startPosition: -1,
                                                debug: false,
                                                  forceHLS: true,
                                                   xhrSetup: function (xhr, url) { xhr.setRequestHeader("Authorization", `Bearer ${token}`); },

                                            }}

                                            poster={vid.icon}
                                            controls={true}
                                            width="100%"
                                             height="auto"/>



                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button variant="secondary" onClick={handleClose}>
                                                Close
                                              </Button>

                                            </Modal.Footer>
                                          </Modal>
                                      </div>

                                )
                            }

                    })()
                }

              </div>
          })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalApi;
