import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Button, Modal, StyleSheet,ScrollView } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import config from '../../../auth0-configuration';
import Video from 'react-native-video';

const VideoScreen = () => {
  const VideoURL = config.serverUrl; 
  const { user, getCredentials } = useAuth0();
  const [videos, setVideos] = useState([]);
  const [token, setToken] = useState(null);
  
  const videoUrl = "http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8";

  useEffect(() => {
    const callSecureApi = async () => {
      if (!user) {
        return;
      }

      try {
        const fetchToken = await getCredentials();
        setToken(fetchToken)
        const response = await fetch(`${VideoURL}/api/content`, {
          headers: {
            Authorization: `Bearer ${fetchToken.accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          for (const item of data) {
            item.icon = await fetch(item.icon, {
              headers: {
                Authorization: `Bearer ${fetchToken.accessToken}`,
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

  return (
    <ScrollView>
      <View style={styles.container}>
      {console.log("video info", videos)}
      <View>
        {videos.map((video) => (
          <View key={video.id}>
            <View style={styles.closeButton}>
            <Image source={{ uri: video.icon }} style={{ width: 100, height: 100 }} />
            <Text>{video.name}</Text>
            <Video source={{uri:videoUrl}}
                
              />
              
            </View>
          </View>
        ))}
      </View>

      
    </View>
  
    </ScrollView>
  )
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
    width: '95%', 
    height: 200, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: 'gray', 
    padding: 30,
    margin:10,
  },
  modal: {
    padding: 50,
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default VideoScreen;
