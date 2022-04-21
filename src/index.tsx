import './utils/mqttPatch';

import React, { Suspense } from 'react';

import { ApolloProvider } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';
import { client } from './graphql/client';
import './i18n';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Suspense
        fallback={
          <CircularProgress
            sx={{ position: 'absolute', top: '50%', left: '50%' }}
          />
        }
      >
        <App />
      </Suspense>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
