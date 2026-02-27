const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json("Token não fornecido");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.TOKEN);
    req.userId = decoded.id;

    next();
  } catch (err) {
    return res.status(401).json("Token inválido");
  }
};

module.exports = { authMiddleware };
