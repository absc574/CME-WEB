import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Button, Modal, StyleSheet } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import config from '../../../auth0-configuration';
import Video from 'react-native-video';


const VideoScreen = (token) => {
  const VideoURL = config.serverUrl; 
  const { user, getCredentials } = useAuth0();
  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [useToken, setToken] = useState([null]);

  useEffect(() => {
   
    console.log('check link for video', selectedVideo?.playlist);
    console.log('Access token inside ', useToken)
    const callSecureApi = async () => {
      if (!user) {
        return;
      }
  
      try {
        token = await getCredentials();
        const response = await fetch(`${VideoURL}/api/content`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'content-Type': 'application/json',
            Authorization: `Bearer ${token.accessToken}`,
  
          },
        });
        console.log('token on props', token.accessToken);
        if (response.ok) {
          const data = await response.json();
          setVideos(data)
          setToken(passToken);
          console.log('request successfull:', data);
          console.log('set value', useToken)
        } else {
          console.error('request failed with status:', response.status);
        }
      } catch (error) {
        console.log('Error:', error);
      }
      let passToken = token.accessToken;
      console.log('use effect token', passToken);
  
      setToken(passToken);
      console.log(useToken);
    };
  
    callSecureApi();
  }, [user, getCredentials]);
 

  const openVideoModal = (video) => {
    setSelectedVideo(video);
    console.log('Video URL info', video);

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
              {console.log('display icon ', video.icon)}
              <Text>{video.name}</Text>
            </TouchableOpacity>
            <Modal visible={showModal} transparent={false}>
              <View>
                <Text>{selectedVideo?.name}</Text>
                <Button title="Close" onPress={closeVideoModal} />
              </View>
              {selectedVideo && (
                <Video
                  source={{
                    uri: selectedVideo.playlist,
                    type: 'm3u8',
                    tech: 'HLS',

                    headers: {
                      Authorization: `Bearer ${useToken}`,
                    },
               
                  }}

                  poster={selectedVideo?.icon}
                  controls={true}
                  width="100%"
                  height="auto"
                  onError={(error) => console.log('Video Error:', error)}
                  {...console.log('why', useToken)}
                />
              )}
            </Modal>
          </View>

        ))}
      </View>
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
