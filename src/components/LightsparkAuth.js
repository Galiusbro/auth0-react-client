import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import generateJwtToken from "./services/GenerateJWT";
import loginToLightspark from "./services/LoginLS"; // Your login function
import {
  CustomJwtAuthProvider,
  InMemoryTokenStorage,
  LightsparkClient,
  StubAuthProvider, // Using StubAuthProvider for testing
} from "@lightsparkdev/wallet-sdk";
import LightsparkDeploymentService from "./services/LightsparkDeploymentService";
import LightsparkInitializationService from "./services/LightsparkInitializationService";

const LightsparkAuth = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [walletInfo, setWalletInfo] = useState(null);
  const [error, setError] = useState(null);
  const [lightsparkClient, setLightsparkClient] = useState(null);
  const [deploymentStatus, setDeploymentStatus] = useState(null);
  const [initializationStatus, setInitializationStatus] = useState(null);

  useEffect(() => {
    const authenticateLightspark = async () => {
      // try {
      //   const auth0Token = await getAccessTokenSilently();
      //   const jwtToken = await generateJwtToken(auth0Token);

      //   // Use StubAuthProvider for initial testing
      //   const authProvider = new StubAuthProvider();
      //   const client = new LightsparkClient(authProvider);
      //   setLightsparkClient(client);

      //   // Log in to Lightspark and get wallet info
      //   const response = await loginToLightspark(auth0Token, jwtToken);
      //   if (!response) {
      //     console.error("Failed to log in to Lightspark");
      //     return;
      //   }
      try {
        // Get Auth0 token and generate Lightspark JWT
        const auth0Token = await getAccessTokenSilently();
        const jwtToken = await generateJwtToken(auth0Token);

        const authProvider = new CustomJwtAuthProvider(
          new InMemoryTokenStorage({ jwtToken })
        );
        const client = new LightsparkClient(authProvider);

        // Perform JWT login
        const loginResult = await client.loginWithJWT();
        console.log("Login successful:", loginResult);

        // Check if wallet needs to be deployed
        const wallet = await client.getCurrentWallet();
        if (wallet.status === "NOT_SETUP") {
          const deployStatus = await client.deployWalletAndAwaitDeployed();
          console.log("Wallet deployed:", deployStatus);
        }
        // Deployment and initialization services
        // const deploymentService = new LightsparkDeploymentService(client);
        // const initializationService = new LightsparkInitializationService(
        //   client
        // );

        // const deployStatus = await deploymentService.deployWallet();
        // setDeploymentStatus(deployStatus);

        // if (deployStatus === "Wallet successfully deployed!") {
        //   const signingPublicKey = response.data.keys.public_key; // Use the public key from the response
        //   const initStatus = await initializationService.initializeWallet(
        //     signingPublicKey
        //   );
        //   console.log("Wallet initialization status:", initStatus);
        //   setInitializationStatus("Wallet initialized successfully");
        // }

        // Save wallet info
        // setWalletInfo(response);
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
          <p>
            <strong>Access Token:</strong> {walletInfo.access_token}
          </p>
          <p>
            <strong>Wallet ID:</strong> {walletInfo.wallet.id}
          </p>
        </div>
      ) : (
        <p>Initializing Lightspark connection...</p>
      )}
    </div>
  );
};

export default LightsparkAuth;
