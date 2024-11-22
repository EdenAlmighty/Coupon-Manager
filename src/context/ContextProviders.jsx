import React from 'react'
import { UserProvider } from './UserContext'
import { LoadingProvider } from './LoadingContext'
import ToastListener from './ToastListenter'

export function ContextProviders({ children }) {
    return (
        <UserProvider>
            <LoadingProvider>
                <ToastListener />
                {children}
            </LoadingProvider>
        </UserProvider>
    )
}
