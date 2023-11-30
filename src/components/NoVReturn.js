import React, { useState, useEffect } from 'react';
import { View, Text, Image, Modal, Button } from 'react-native';
import ReactHlsPlayer from 'react-hls-player';
import { useAuth0 } from 'react-native-auth0';
import config from '../../../auth0-configuration';
import Video from 'react-native-video';
const VideoScreen = () => {
  const VideoURL = config.serverUrl;
  const { getCredentials, user } = useAuth0();
  const [VideData, setVideoData] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setModalId("");
  const handleShow = () => setShow(true);

  const [modalId, setModalId] = React.useState("");
  let token = "";



  useEffect(() => {
    const callSecureApi = async () => {
      try {
        token = await getCredentials();
        const response = await fetch(`${VideoURL}/api/content`, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
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
                Authorization: `Bearer ${token.accessToken}`,
              },
            })
              .then((res) => res.blob())
              .then((blob) => URL.createObjectURL(blob))
              .catch((e) => console.log("e.message", e.message));
          }
  
          setVideoData(data);
          console.log(data)
        }
      } catch (e) {
        console.log(e);
        return {};
      }
    }
    callSecureApi()
  }, [user, getCredentials]);

  return (
    <View>
      {user && (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {
              VideData.map((vidInfo, i) => (
                <View key={vidInfo.id} style={{ width: '33%' }}>
                  {vidInfo.icon !== undefined ? (
                    <View>
                      <Image source={{ uri: vidInfo.icon }} style={{ width: 100, height: 100 }} onClick={() => setModalId(`modal${i}`)} />
                      <Text>{vidInfo.name}</Text>

                      <Modal visible={modalId === `modal${i}`}>
                        <View>
                          <Text>{vidInfo.name}</Text>
                          <Video
                            source={{ uri: vidInfo.playlist }}
                            {...console.log('Video Url',vidInfo.playlist)}
                            config={{
                              maxBufferLength: 4,
                              minAutoBitrate: 0,
                              lowLatencyMode: true,
                              autoStartLoad: true,
                              startPosition: -1,
                              debug: false,
                              forceHLS: true,
                              xhrSetup: (xhr, url) => xhr.setRequestHeader("Authorization", `Bearer ${token.accessToken}`),
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
              ))
            }
          </View>
        </View>
      )}
    </View>
  );
};

export default VideoScreen;
