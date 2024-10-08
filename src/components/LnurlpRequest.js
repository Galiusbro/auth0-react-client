import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const LnurlpRequest = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [lnurlpResult, setLnurlpResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLnurlpRequest = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();

      const options = {
        method: 'POST',
        url: 'http://127.0.0.1:5000/initial_lnurlp_request',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios(options);

      let result = response.data;
      if (result.lnurlp_response && typeof result.lnurlp_response === 'string') {
        const match = result.lnurlp_response.match(/window\.location\.href="([^"]+)"/);
        if (match) {
          result.redirectUrl = match[1];
        }
      }

      setLnurlpResult(result);
    } catch (error) {
      console.error('Error making LNURLp request:', error);
      setLnurlpResult({ error: 'Failed to perform LNURLp request' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">LNURLp Request</h2>
        <button
          onClick={handleLnurlpRequest}
          disabled={loading}
          className={`w-full py-3 px-4 mb-6 font-semibold text-white rounded-lg transition duration-300 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Processing...' : 'Send LNURLp Request'}
        </button>
        {lnurlpResult && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Result:</h3>
            <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm text-gray-700 mb-4">
              {JSON.stringify(lnurlpResult, null, 2)}
            </pre>
            {lnurlpResult.redirectUrl && (
              <div className="text-center">
                <h4 className="text-md font-semibold text-gray-800 mb-2">Redirect URL:</h4>
                <a
                  href={lnurlpResult.redirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300"
                >
                  {lnurlpResult.redirectUrl}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LnurlpRequest;
