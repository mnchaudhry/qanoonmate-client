"use client"

import { ContextProvider } from '@/context/useStateContext'
import store, { persistor } from '@/store/store'
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { SocketProvider } from '@/context/useSocketContext'
import AuthProvider from './AuthProvider'
import HydrationProvider from './HydrationProvider'
import TokenRefreshProvider from './TokenRefreshProvider'

const StateProvider = ({ children }: { children: ReactNode }) => {

  return (
    <Provider store={store} >
      <HydrationProvider>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>
            <ContextProvider>
              <SocketProvider>
                <TokenRefreshProvider>
                  {children}
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