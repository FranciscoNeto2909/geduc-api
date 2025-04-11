const jwt = require("jsonwebtoken")
const { promisify } = require("util")

module.exports = {
    isLogged: async (req, res, next) => {
        const authHeader = await req.headers.authorization;

        const [,token] = await authHeader.split(" ")

        if (!authHeader || !token) {
            return res.status(400).json("Erro: login to access this page")
        }
        try {
            const decode = await promisify(jwt.verify)(token, "a92nfj40d92ny645lf2s03md9n2g");
            req.userId = decode.id;
            return next()
        } catch (error) {
            return res.status(400).json("Erro:invalid token")
        }
    }
}