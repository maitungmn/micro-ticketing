import React from "react"
import axios from "axios"

export default ({url, method, body, onSuccess}) => {
  const [errors, setErrors] = React.useState(null)

  const doRequest = async () => {
    try {
      setErrors(null)
      const response = await axios[method](url, body)

      if(onSuccess) {
        onSuccess(response.data)
      }

      return response.data
    } catch (e) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {e.response.data.errors.map((err, index) => (
              <li key={index}>{err.message}</li>
            ))}
          </ul>
        </div>
      )
      throw e
    }
  }

  return {doRequest, errors}
}