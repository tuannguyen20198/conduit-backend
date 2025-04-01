import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TanstackQueryProvider from './lib/tanstack-query-provider'
import App from './App'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TanstackQueryProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </TanstackQueryProvider>
  </StrictMode>,
)
