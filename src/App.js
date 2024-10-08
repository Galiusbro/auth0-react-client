import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import TodoList from "./components/TodoList";
import LnurlpRequest from "./components/LnurlpRequest";
import LightsparkAuth from "./components/LightsparkAuth"; // Импортируем наш компонент для Lightspark

function App() {
  const { loginWithRedirect, logout, isAuthenticated, loginWithPopup, user, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-2xl font-semibold text-gray-700">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-5">
      {isAuthenticated ? (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl text-center">
          <button
            onClick={() => logout({ returnTo: window.location.origin })}
            className="mb-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
          <div className="text-left mb-6">
            <h2 className="text-xl font-bold mb-2">User Information</h2>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap">{JSON.stringify(user, null, 2)}</pre>
          </div>

          {/* Компонент Todo и другие */}
          {/* <TodoList /> */}
          <LightsparkAuth />
          <LnurlpRequest />

          {/* Компонент для Lightspark аутентификации */}
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={() => loginWithRedirect()}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
          <button
            onClick={() => loginWithPopup()}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Login with Popup
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
