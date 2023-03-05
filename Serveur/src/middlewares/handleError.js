import { AppError } from "../error.js"

// eslint-disable-next-line no-unused-vars
const handleError = (err, req, res, next) => {
  if (!(err instanceof AppError)) {
    // eslint-disable-next-line no-console
    console.error(err)

    res.send({ error: ["Oops. Something went wrong."] })

    return
  }

  res.status(err.httpCode).send({ error: err.errors })
}

export default handleError