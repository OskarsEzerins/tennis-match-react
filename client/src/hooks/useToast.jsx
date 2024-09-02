import React, { useState, useCallback, createContext, useContext, useEffect } from 'react'

import { Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'

const Alert = (props) => {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

const ToastContext = createContext()

export const ToastProvider = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('info')

  const showToast = useCallback((msg, severity = 'info') => {
    setMessage(msg)
    setSeverity(severity)
    setOpen(true)
  }, [])

  const savePendingToast = (msg, severity = 'info') => {
    const pendingToasts = JSON.parse(sessionStorage.getItem('pendingToasts')) || []
    pendingToasts.push({ msg, severity })
    sessionStorage.setItem('pendingToasts', JSON.stringify(pendingToasts))
  }

  const showPendingToasts = useCallback(() => {
    const pendingToasts = JSON.parse(sessionStorage.getItem('pendingToasts')) || []
    pendingToasts.forEach(({ msg, severity }) => showToast(msg, severity))
    sessionStorage.removeItem('pendingToasts')
  }, [showToast])

  const handleClose = useCallback((_event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }, [])

  useEffect(() => {
    showPendingToasts()
  }, [showPendingToasts])

  return (
    <ToastContext.Provider value={{ showToast, savePendingToast }}>
      {children}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  return useContext(ToastContext)
}
