export const handleXhrError = ({ error, showToast, setSubmitting }) => {
  if (showToast) {
    showToast(error.message, 'error')
  }
  if (setSubmitting) {
    setSubmitting(false)
  }

  console.debug('Error:', error)
}

export const fetchWithErrorHandling = (url, options) =>
  fetch(url, options).then((res) => {
    if (!res.ok) {
      return res.text().then((errorText) => {
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(`HTTP error ${res.status} - ${errorData.error}`)
        } catch (e) {
          throw new Error(`HTTP error ${res.status}`)
        }
      })
    }

    return res
  })
