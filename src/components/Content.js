import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Button } from "react-native";
import ReactHlsPlayer from "react-hls-player"
import { useAuth0 } from 'react-native-auth0';
import Modal from 'react-bootstrap';
import config from "../../../auth0-configuration";

let Token = '';
const VideoScreen = () => {
    const VideoURL = config.serverUrl ;
    const { user, getCredentials } = useAuth0();
    const [video, setVideo] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setModalId("");
    const handleShow = () => setShow(true);

    const [modalId, setModalId] = React.useState("");
    const callSecureApi = async () => {
        try {
            Token = await getCredentials();
            console.log("Access Token" + Token);

            const response = await fetch(
                `${VideoURL}/api/content`,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`,
                    },
                },
            );
            if (response.ok) {
                const data = await response.json();
                for (const item of data) {
                    item.icon = await fetch(item.icon, {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${Token}`,
                        },

                    })
                        .then((res) => res.blob())
                        .then((blob) => URL.createObjectURL(blob))
                        .catch((e) => console.log("e.message", e.message));

                }
                setVideo(data)
            }
        } catch (error) {
            console.log(error);
            return {};

        }
    }
    useEffect(() => {
        callSecureApi()
     
    }, []);
    return (
        <View>
            {!user && (
                <View className="container">
                    <View className="row videos_list">
                        {video.map((vid, id) => {
                            return <View key={vid.id} className="col-md-4">
                                {
                                    (() => {
                                        if (vid.icon != undefined) {
                                            return (
                                                <View>
                                                    <img src={vid.icon} className="img-thumbnail thumbs" onClick={() => setModalId(`modal${i}`)} />
                                                    <h4>{vid.name} </h4>
                                                    <Modal size="lg" show={modalId === `modal${i}`} onHide={handleClose}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>{vid.name}</Modal.Title>
                                                            <Modal.Body>
                                                                <ReactHlsPlayer
                                                                    src={vid.playlist}
                                                                    hlsConfig={
                                                                        {
                                                                            maxLoadingDelay: 4,
                                                                            minAutoBitrate: 0,
                                                                            lowLatencyMode: true,
                                                                            autoStartLoad: true,
                                                                            startPosition: -1,
                                                                            debug: false,
                                                                            forceHLS: true,
                                                                            xhrSetup: function (xhr, url) { xhr.setRequestHeader("Authorization", `Bearer ${Token}`); },
                                                                        }}
                                                                    poster={vid.icon}
                                                                    controls={true}
                                                                    width="100%"
                                                                    height="auto"
                                                                />
                                                            </Modal.Body>
                                                            <module.Footer>
                                                                <Button variant="secondary" onClick={handleClose}>

                                                                </Button>
                                                            </module.Footer>
                                                        </Modal.Header>
                                                    </Modal>
                                                </View>
                                            )

                                        }
                                    })
                                }

                            </View>
                        })}
                    </View>

                </View>
            )}
        </View>
    )
}
export default VideoScreen