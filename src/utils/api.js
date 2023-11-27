export async function getAllUsers() {
    try {
      const res = await fetch("http://206.189.91.54/api/v1/users", {
        method: 'GET',
        headers: {
          "access-token": localStorage.getItem("access-token") || "",
          "uid": localStorage.getItem("uid") || "",
          "client": localStorage.getItem("client") || "",
          "expiry": localStorage.getItem("expiry") || "",
          "Content-Type": "application/json"
        }
      });
  
      const data = await res.json();
      const dataLength = data.data.length;
      let dataLengthless = dataLength - 400;
  
      return data.data.slice(dataLengthless, dataLength).map(user => ({
        user_id: user.id,
        email: user.email
      }));
  
    } catch (error) {
      console.log(error);
      return [];
    }
  }