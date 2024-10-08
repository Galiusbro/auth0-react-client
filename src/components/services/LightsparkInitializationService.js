export default class LightsparkInitializationService {
    constructor(client) {
      this.client = client;
    }
  
    async initializeWallet(signingPublicKey) {
      try {
        const response = await this.client.initializeWallet("RSA", signingPublicKey);
        console.log("Wallet initialization response:", response);
  
        return response;
      } catch (error) {
        console.error("Error initializing wallet:", error);
        throw error;
      }
    }
  }
  