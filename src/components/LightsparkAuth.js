import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import generateJwtToken from "./services/GenerateJWT";
import loginToLightspark from "./services/LoginLS";

const LightsparkAuth = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [walletInfo, setWalletInfo] = useState(null);  // Состояние для информации о кошельке
  const [error, setError] = useState(null);

  useEffect(() => {
    const authenticateLightspark = async () => {
      try {
        // Получаем Auth0 токен для аутентификации
        const auth0Token = await getAccessTokenSilently();

        // Генерация JWT токена или возврат существующего токена
        const jwtToken = await generateJwtToken(auth0Token);
        console.log("Lightspark JWT token generated or retrieved:", jwtToken);

        // Логин в Lightspark и получение данных о кошельке
        const response = await loginToLightspark(auth0Token, jwtToken);
        console.log("Lightspark response:", response);
        
        // Сохранение информации о кошельке в состояние
        setWalletInfo(response);

      } catch (error) {
        console.error("Lightspark authentication failed:", error);
        setError(error);
      }
    };

    if (isAuthenticated) {
      authenticateLightspark();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (error) {
    return <div>Error connecting to Lightspark: {error.message}</div>;
  }

  return (
    <div>
      {walletInfo ? (
        <div>
          <h2>Successfully connected to Lightspark!</h2>
          <p><strong>Access Token:</strong> {walletInfo.access_token}</p>
          <p><strong>Wallet ID:</strong> {walletInfo.wallet.id}</p>
        </div>
      ) : (
        <p>Initializing Lightspark connection...</p>
      )}
    </div>
  );
};

export default LightsparkAuth;
