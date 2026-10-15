function cekApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (apiKey !== process.env.API_KEY) {
    const error = new Error("API key tidak valid");
    error.status = 401;

    return next(error);
  }

  next();
}

module.exports = cekApiKey;