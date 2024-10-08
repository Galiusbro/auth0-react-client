import { useLightsparkClient } from "@lightsparkdev/react-wallet";
import { useEffect, useState } from "react";

function DashboardPage() {
  const lightsparkClient = useLightsparkClient();
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    if (lightsparkClient === null) {
      console.error("LightsparkClient is null");
      return;
    }

    // Call the getWalletDashboard() method directly on the lightsparkClient instance
    lightsparkClient
      .getClient()
      .getWalletDashboard()
      .then((walletDashboard) => {
        if (walletDashboard === null) {
          console.error("getWalletDashboard() returned null");
          return;
        }

        setDashboard(walletDashboard);
      })
      .catch((error) => {
        console.error("getWalletDashboard() failed:", error);
      });
  }, [lightsparkClient, setDashboard]);

  if (dashboard === null) {
    return <p>Loading...</p>;
  }

  return <div>{JSON.stringify(dashboard)}</div>;
}

export default DashboardPage;
