import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import './fonts/coolvetica.ttf'
import { ToastProvider } from './hooks'
import './index.css'

ReactDOM.render(
  <ToastProvider>
    <App />
  </ToastProvider>,
  document.getElementById('root')
)
