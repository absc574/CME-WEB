import React, { useState, useEffect } from 'react';
import { View, Text, Image, Modal, Button } from 'react-native';
import ReactHlsPlayer from 'react-native-react-native-hls-player';
import { useAuth0 } from '@auth0/auth0-react';
import config from '../../../auth0-configuration';

const VideoScreen = () => {
  const VideoURL = config.serverUrl;
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [video, setVideo] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setModalId("");
  const handleShow = () => setShow(true);

  const [modalId, setModalId] = React.useState("");
  let token = "";

  const callSecureApi = async () => {
    try {
      token = await getAccessTokenSilently();
      const response = await fetch(`${VideoURL}/api/content`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Fetch icon URLs and create blob URLs
        for (const item of data) {
          item.icon = await fetch(item.icon, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => res.blob())
            .then((blob) => URL.createObjectURL(blob))
            .catch((e) => console.log("e.message", e.message));
        }

        setVideo(data);
      }
    } catch (e) {
      console.log(e);
      return {};
    }
  }

  useEffect(() => {
    callSecureApi()
  }, []);

  return (
    <View>
      {isAuthenticated && (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {video.map((vid, i) => (
              <View key={vid.id} style={{ width: '33%' }}>
                {vid.icon !== undefined ? (
                  <View>
                    <Image source={{ uri: vid.icon }} style={{ width: 100, height: 100 }} onClick={() => setModalId(`modal${i}`)} />
                    <Text>{vid.name}</Text>

                    <Modal visible={modalId === `modal${i}`}>
                      <View>
                        <Text>{vid.name}</Text>
                        <ReactHlsPlayer
                          source={{ uri: vid.playlist }}
                          config={{
                            maxBufferLength: 4,
                            minAutoBitrate: 0,
                            lowLatencyMode: true,
                            autoStartLoad: true,
                            startPosition: -1,
                            debug: false,
                            forceHLS: true,
                            xhrSetup: (xhr, url) => xhr.setRequestHeader("Authorization", `Bearer ${token}`),
                          }}
                          poster={vid.icon}
                          controls={true}
                          style={{ width: '100%', height: 'auto' }}
                        />
                        <Button title="Close" onPress={handleClose} />
                      </View>
                    </Modal>
                  </View>
                ) : null}
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default VideoScreen;
