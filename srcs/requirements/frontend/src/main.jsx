import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './AuthContext.jsx'
import './index.css'
import './i18n/index.js'
import Router from './router.jsx'

// TESTS
// App        : default Vite template                → src/App.jsx
// DrawBoard  : canvas drawing board test            → src/click_App.jsx
// Click      : click interaction test               → src/click_App.jsx
// Draw       : draw interaction test                → src/click_App.jsx
// import App from './App.jsx'
// import DrawBoard from './click_App.jsx'
// import { Click, Draw } from './click_App.jsx'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AuthProvider>
			<Router />
		</AuthProvider>
	</StrictMode>,
)
