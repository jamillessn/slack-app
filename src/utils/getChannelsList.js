import { toast } from 'react-toastify';
import { getHeaders } from './getHeaders';

export async function getChannelsList() {
  const headers = getHeaders();

  try {
    const res = await fetch("http://206.189.91.54/api/v1/channels/", {
      method: "GET",
      headers: {
        'access-token': headers.accessToken || "",
        'client': headers.client || "",
        'expiry': headers.expiry || "",
        'uid': headers.uid || "",
        "Content-Type": "application/json"
      },
    });

    const responseData = await res.json();

    if (Array.isArray(responseData.data)) {
      return responseData.data.map(chanId => ({
        id: chanId.id,
        channel_name: chanId.name
      }));
    }
  } catch (error) {
    toast.error(error.error, {
      position: toast.POSITION.TOP_CENTER,
    });
    return [];
  }
}
