import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { LightsparkClient, CustomJwtAuthProvider } from "@lightsparkdev/wallet-sdk";
import LightsparkDeploymentService from "./services/LightsparkDeploymentService";
import LightsparkInitializationService from "./services/LightsparkInitializationService";

const LightsparkAuth = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [lightsparkClient, setLightsparkClient] = useState(null);
  const [deploymentStatus, setDeploymentStatus] = useState(null);
  const [initializationStatus, setInitializationStatus] = useState(null);
  const [keys, setKeys] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authenticateAndDeploy = async () => {
      try {
        // Получаем токен от Auth0
        const token = await getAccessTokenSilently();

        // Создаем провайдер аутентификации с токеном
        const authProvider = new CustomJwtAuthProvider(token);

        // Инициализируем Lightspark клиент
        const client = new LightsparkClient(authProvider);
        setLightsparkClient(client);

        // Запрос ключей из базы
        const keysResponse = await axios.post(
          "http://127.0.0.1:5000/generate_keys_if_absent",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setKeys(keysResponse.data.keys);

        // Создаем инстансы сервисов для деплоя и инициализации
        const deploymentService = new LightsparkDeploymentService(client);
        const initializationService = new LightsparkInitializationService(client);

        // Деплой кошелька
        const deployStatus = await deploymentService.deployWallet();
        setDeploymentStatus(deployStatus);

        // После деплоя, инициализируем кошелек
        if (deployStatus === "Wallet successfully deployed!") {
          const signingPublicKey = keysResponse.data.keys.public_key; // Извлекаем публичный ключ
          const initStatus = await initializationService.initializeWallet(signingPublicKey);
          console.log("Wallet initialization status:", initStatus);
          setInitializationStatus("Wallet initialized successfully");
          console.log("signingPublicKey:", signingPublicKey);
        }
      } catch (error) {
        setError(error);
      }
    };

    if (isAuthenticated) {
      authenticateAndDeploy();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (!isAuthenticated) {
    return <p>Please log in to connect to Lightspark.</p>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div>
      {lightsparkClient ? (
        <div>
          <p>Successfully connected to Lightspark!</p>
          {deploymentStatus && <p>{deploymentStatus}</p>}
          {initializationStatus && <p>{initializationStatus}</p>}
          {keys && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-2">Keys Information</h2>
              <p className="text-sm">
                <strong>User ID:</strong> {keys.user_id}
              </p>
              <p className="text-sm">
                <strong>Key ID:</strong> {keys._id}
              </p>
              <p className="text-sm">
                <strong>Certificate:</strong>
              </p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto break-words whitespace-pre-wrap max-h-40">
                {keys.certificate}
              </pre>
              <p className="text-sm">
                <strong>Public Key (Base64):</strong>
              </p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto break-words whitespace-pre-wrap max-h-40">
                {keys.public_key}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <p>Initializing Lightspark connection...</p>
      )}
    </div>
  );
};

export default LightsparkAuth;
