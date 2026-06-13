import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "./graphql/client";
import { Authprovider } from './context/Authcontext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <Authprovider>
    <App />
    </Authprovider>
    </ApolloProvider>
  </StrictMode>,
)
