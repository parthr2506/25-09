const jwt = require("jsonwebtoken")
const prisma = require("../prisma/prismaClient")

const auth = async (req, res, next) => {
    const header = req.headers.authorization
    if (!header) {
        return res.status(401).json({ error: "No token found" })
    }
    const token = header.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const user = await prisma.user.findUnique({
            where: {
                id: payload.id
            }
        })
        if (!user) {
            return res.status(401).json({ error: "User not found" })
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({ error: "Invalid Token" })
    }
}

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ error: 'Not Allowed' });
        }
        next();
    };
};

module.exports = { auth, requireRole }