import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { ClerkProvider } from '@clerk/clerk-react'
import ClickSpark from './components/ClickSpark';
import useUIStore from './store/useUIStore';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

function Root() {
  const sparkSettings = useUIStore((state) => state.sparkSettings);
  
  return (
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <ClickSpark
          sparkSize={sparkSettings.size}
          sparkRadius={sparkSettings.radius}
          sparkCount={sparkSettings.count}
          duration={sparkSettings.duration}
        >
          <App />
        </ClickSpark>
      </ClerkProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Root />)
