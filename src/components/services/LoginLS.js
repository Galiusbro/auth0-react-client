import axios from "axios";

const loginToLightspark = async (authToken, jwtToken) => {
  try {
    const options = {
      method: "POST",
      url: "http://localhost:3033/api/lightspark-login",  // Новый маршрут
      headers: {
        Authorization: `Bearer ${authToken}`,  // Передаем переданный токен в заголовке
        "Content-Type": "application/json",
      },
      data: {
        jwtToken,  // Передаем JWT-токен в теле запроса
      },
    };

    const response = await axios(options);
    console.log("Ответ от Lightspark API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка при аутентификации Lightspark:", error);
  }
};

export default loginToLightspark;
