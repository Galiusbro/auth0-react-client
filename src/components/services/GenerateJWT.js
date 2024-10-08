import axios from "axios";

const generateJwtToken = async (authToken) => {
    try {
      const options = {
        method: "POST",
        url: "http://localhost:3033/api/generate-token",
        headers: {
          Authorization: `Bearer ${authToken}`,  // Передаем переданный токен в заголовке
          "Content-Type": "application/json",
        },
      };
  
      const response = await axios(options);
      console.log("Сгенерированный JWT токен:", response.data.jwtToken);
  
      return response.data.jwtToken;
    } catch (error) {
      console.error("Ошибка при получении JWT токена:", error);
    }
  };
  
  export default generateJwtToken;
  