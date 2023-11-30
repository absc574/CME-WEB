import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Button, Modal, StyleSheet } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import config from '../../../auth0-configuration';
//import HlsPlayer from 'react-hls-player'
import Video from 'react-native-video';

const VideoScreen = () => {
  const VideoURL = config.serverUrl; // Replace with your server URL
  const { user, getCredentials } = useAuth0();
  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);


  useEffect(() => {
    const callSecureApi = async () => {
      if (!user) {
        return;
      }

      try {
        const token = await getCredentials();
        const response = await fetch(`${VideoURL}/api/content`, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          for (const item of data) {
            item.icon = await fetch(item.icon, {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            })
              .then((res) => res.blob())
              .then((blob) => URL.createObjectURL(blob))
              .catch((e) => console.log('Error:', e.message));
          }
          setVideos(data);
          console.log('data info', data);
        }
      } catch (error) {
        console.log('Error:', error);
      }
    };

    callSecureApi();
  }, [user, getCredentials]);

  const openVideoModal = (video) => {
    setSelectedVideo(video);
    console.log('Video URL info', selectedVideo);
    setShowModal(true);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      {!user && <Text>Login to view videos</Text>}
      {console.log("video info", videos)}
      <View>
        {videos.map((video) => (
          <View key={video.id}>
            <TouchableOpacity style={styles.closeButton} onPress={() => openVideoModal(video)}>
              <Image source={{ uri: video.icon }} style={{ width: 100, height: 100 }} />
              <Text>{video.name}</Text>

            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Modal visible={showModal} transparent={false} >
        <View style={styles.modal}>
          <Text>{selectedVideo?.name}</Text>
          <Button title="Close" onPress={closeVideoModal} />
        </View>
        {selectedVideo && (
          <Video
            source={{ uri: selectedVideo.playlist }}
            {...console.log('check link for video', selectedVideo?.playlist)}
            style={styles.playerVideo}
            autoplay={false}
            controls={true}

            hlsConfig={{
              //   maxLoadingDelay: 4,
              //   minAutoBitrate: 0,
              //   lowLatencyMode: true,
              //   autoStartLoad: true,
              //   startPosition: -1,
              //   debug: false,
              //   forceHLS: true,
              xhrSetup: (xhr, url) => {
                xhr.setRequestHeader('Authorization', `Bearer ${token.accessToken}`);
              },
            }}
            poster={selectedVideo.icon}
            // controls={true}
            width="100%"
            height="auto"
          />
        )}
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: 'center'
  },
  playerVideo: {
    flex: 1,
    width: 320,
    

  },
  closeButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  modal: {
    padding: 50,
    flex: 1
  }

})

export default VideoScreen;
