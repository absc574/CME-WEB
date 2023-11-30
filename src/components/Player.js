/*import { useAuth0 } from "@auth0/auth0-react";
import React,{useState} from 'react';



const Player = () => {
  const { getAccessTokenSilently,isAuthenticated} = useAuth0();
  
  const token = await getAccessTokenSilently();
  console.log(token);

/*const CustomVideo = ({ videoUrl }) => {
    const options = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const [url, setUrl] = useState()
    useEffect(() => {
        fetch(videoUrl, options)
        .then(response => response.blob())
            .then(blob => {
            setUrl(URL.createObjectURL(blob))
            
        });
    }, [videoUrl])
   
    
    return (
      <></>
        //<ReactPlayer url={url} width="100%"  controls />
    )
//}

};

export default Player;*/