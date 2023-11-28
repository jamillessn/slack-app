import React, { useState, useEffect} from "react";
 
 function CreateChannel() {
    const [userId , setUserId ] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [channelName, setChannelName] = useState('');

    
    const handleCreateChannel = () => {
        onOpen();
      };

      const handleSubmit = async (channelName, userId) => {

        try {
          const res = await fetch("http://206.189.91.54/api/v1/auth/", {
            method: "POST",
            headers: {
              "access-token": localStorage.getItem("access-token") || "",
              "uid": localStorage.getItem("uid") || "",
              "client": localStorage.getItem("client") || "",
              "expiry": localStorage.getItem("expiry") || "",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ channelName: channelName, userId: userId })
          });
      
        //  localStorage.setItem("access-token", res.headers.get("access-token"))
      
          const responseData = await res.json();
      
          if(responseData.status === "success"){
            toast.success('Channel created!', {
              position: toast.POSITION.TOP_CENTER,
            });
          }
          else if(responseData.status === "error"){
            throw responseData
          }
      
        } catch (error) {
            toast.error(error.errors.full_messages[0], {
              position: toast.POSITION.TOP_CENTER,
            });
        }
      };
      
    // const handleCreateChannelSubmit = async (channelName, userId) => {
    //     console.log('Channel created:', channelName);
    
    //     // Close the modal
    //     onClose();
    //   }  

    //     try {
    //       const res = fetch("http://206.189.91.54/api/v1/channels/", {
    //         method: "POST",
    //         headers: {
    //           "access-token": localStorage.getItem("access-token") || "",
    //           "uid": localStorage.getItem("uid") || "",
    //           "client": localStorage.getItem("client") || "",
    //           "expiry": localStorage.getItem("expiry") || "",
    //           "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({ userId: userId, channelName: channelName })
    //       });
      
    //       // create for loop retrieving the list of channels
          
    //       if(responseData.status === "success"){
    //         toast.success('Channel created!', {
    //           position: toast.POSITION.TOP_CENTER,
    //         });
    //       }
    //       else if(responseData.status === "error"){
    //         throw responseData
    //       }
      
    //     } catch (error) {
    //         toast.error(error.errors.full_messages[0], {
    //           position: toast.POSITION.TOP_CENTER,
    //         });
    //     }
      

      const channelCreateFunction = (channelName, user_id) => {
        console.log(channelName, user_id)
      }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserId(user.id);
    
        setHeaders({
            'Content-Type' : 'application/json', 
            'access-token' : localStorage.getItem('access-token'),
            'client' : localStorage.getItem('client'),
            'expiry' : localStorage.getItem('expiry'), 
            'uid' : localStorage.getItem('uid')
        })
    }, [userId]);

   

   return(
     {/* "Create Channel" button */}
     <Button
     colorScheme="teal"
     mb={4}
     onClick={handleCreateChannel}
   >
     Create Channel
   </Button>
   
   )
}

export default createChannel;

