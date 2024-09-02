import React, { useState, useCallback, createContext, useContext } from 'react'

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

  const handleClose = useCallback((_event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
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
