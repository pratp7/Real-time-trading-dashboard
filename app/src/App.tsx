import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch('/api/')

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = await response.text()
        setMessage(data)
        setError(null)
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load data from the API.',
        )
      }
    }

    getData()
  }, [])

  return (
    <div>
      {error ? <p>{error}</p> : null}
      {message ? <p>{message}</p> : null}
    </div>
  )
}

export default App
