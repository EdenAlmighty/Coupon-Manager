import React from 'react'
import { UserProvider } from './UserContext'
import { LoadingProvider } from './LoadingContext'

export function ContextProviders({ children }) {
    return (
        <UserProvider>
            <LoadingProvider>
                {children}
            </LoadingProvider>
        </UserProvider>
    )
}
