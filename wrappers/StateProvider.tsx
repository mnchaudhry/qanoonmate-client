"use client"

import { ContextProvider } from '@/context/useStateContext'
import store, { persistor } from '@/store/store'
import React, { ReactNode, useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { SocketProvider } from '@/context/useSocketContext'
import AuthProvider from './AuthProvider'
import HydrationProvider from './HydrationProvider'
import TokenRefreshProvider from './TokenRefreshProvider'
import { ThemeProvider } from './ThemeProvider'
import { setupInterceptors } from '@/store/api/interceptors'

const StateProvider = ({ children }: { children: ReactNode }) => {
  // Set up axios interceptors after store is available
  useEffect(() => {
    setupInterceptors(store);
  }, []);

  return (
    <Provider store={store} >
      <HydrationProvider>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>
            <ContextProvider>
              <SocketProvider>
                <TokenRefreshProvider>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                  >
                    {children}
                  </ThemeProvider>
                </TokenRefreshProvider>
              </SocketProvider>
            </ContextProvider>
          </AuthProvider>
        </PersistGate>
      </HydrationProvider>
    </Provider>
  )
}

export default StateProvider