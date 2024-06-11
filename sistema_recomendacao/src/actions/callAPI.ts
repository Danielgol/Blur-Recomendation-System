import axios from 'axios';

export default async function callAPI(image: any) {
    const API_URL = "http://localhost:8080";
    const API_ENDPOINT = "/getpred";
    const API_PARAM = "image"
    
    const formData = new FormData();
    formData.append(API_PARAM, image);

    const result = await axios.post(API_URL+API_ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return result
  }
  