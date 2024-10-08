export default class LightsparkDeploymentService {
  constructor(client) {
    this.client = client;
  }

  async deployWallet() {
    try {
      // let walletStatus = await this.client.deployWallet();
      // console.log("Wallet deployment status:", walletStatus);

      // while (walletStatus !== "DEPLOYED" && walletStatus !== "FAILED") {
      //   await new Promise(resolve => setTimeout(resolve, 5000));
      //   const wallet = await this.client.getCurrentWallet();
      // //   walletStatus = await this.client.getWalletStatus();
      //   console.log("wallet", wallet);
      // }

      let walletStatus = await this.client.deployWalletAndAwaitDeployed();
      return walletStatus === "DEPLOYED"
        ? "Wallet successfully deployed!"
        : "Wallet deployment failed.";
    } catch (error) {
      console.error("Error deploying wallet:", error);
      throw error;
    }
  }
}
