const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { auth } = require("../middlewares/auth")
const prisma = require("../prisma/prismaClient");
const router = express.Router();

router.get('/', auth, async (req, res) => {
    res.status(200).json({
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
    })
})

router.get('/admin/users', auth, async (req, res) => {
    res.status(200).json({
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
    })
})
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Please provide all fields" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '10d' });
        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (e) {
        if (e.code === 'P2002' && e.meta?.target.includes('email')) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        console.log(e);
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Please provide both email and password." });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '10d' });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
});

router.post("/logout", async (req, res) => {
    try {
        //will remove the token in the frontend
        res.status(200).json({ message: "Logout Success" })

    } catch (error) {
        res.status(500).json({ error: "An unexpected error occured" })
    }
})

module.exports = router;
