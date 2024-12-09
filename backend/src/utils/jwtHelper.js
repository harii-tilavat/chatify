const jwt = require("jsonwebtoken");

const cookiesDefaultOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
}

class JwtHelpwer {
    static generateToken(data) {
        return jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn: '7d' });
    }
    static verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
    static setTokenCookie(res, token, options = {}) {
        const cookieOptions = { ...cookiesDefaultOptions, ...options };
        res.cookie("authToken", token, cookieOptions);
    }
    static clearCookie(res) {
        const cookieOptions = { ...cookiesDefaultOptions, maxAge: new Date(0) };
        res.cookie("authToken", "", cookieOptions);
    }
}
module.exports = JwtHelpwer;