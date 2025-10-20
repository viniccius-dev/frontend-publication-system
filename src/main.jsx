import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";

import { AppRoutes } from "./routes";
import { AuthProvider } from "./hooks/auth";
import { useEffect } from "react";
import { api } from "./services/api";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ApiLogger() {
  useEffect(() => {
    // avoid calling protected endpoints when user is not authenticated (login page)
    const token = localStorage.getItem('@system:token');
    if (!token) return; // nothing to do when there's no token

    (async () => {
      try {
        const [typesRes, domainsRes] = await Promise.all([
          api.get('/types-of-publication'),
          api.get('/domains')
        ]);

        console.info('AUTO LOG types:', typesRes.data);
        console.info('AUTO LOG domains:', domainsRes.data);
      } catch (err) {
        console.error('AUTO LOG error fetching filters', err);
      }
    })();
  }, []);

  return null;
}
import theme from "./styles/theme";
import GlobalStyles from "./styles/global";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ApiLogger />
  <ToastContainer position="top-right" autoClose={4000} />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
