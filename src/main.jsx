import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './assets/styles/main.scss'
import { ContextProviders } from './context/ContextProviders.jsx'

createRoot(document.getElementById('root')).render(
    <ContextProviders>
        <App />
    </ContextProviders>
)