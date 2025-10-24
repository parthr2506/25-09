const express = require('express');
const prisma = require('../prisma/prismaClient');
const bcrypt = require("bcryptjs");
const { auth, requireRole } = require('../middlewares/auth');
const router = express.Router();
router.get('/', auth, requireRole('SELLER'), async (req, res) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
        }
    });
    res.json(users);
});


router.post('/add', auth, requireRole('SELLER'), async (req, res) => {
    const { email, password, role = 'USER' } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide all details.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role.toUpperCase()
            }
        });
        res.status(201).json(user);
    } catch (error) {
        if (error.code === 'P2002' && error.meta?.target.includes('email')) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        console.error("Error creating user:", error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

router.post('/assign-role', auth, requireRole('SELLER'), async (req, res) => {
    // console.log("Role Changed")
    const { userId, role } = req.body;
    const uppercaseRole = role.toUpperCase();

    if (!['USER', 'SELLER'].includes(uppercaseRole)) {
        return res.status(400).json({ error: 'Invalid role' });
    }
    await prisma.user.update({
        where:
            { id: userId },
        data: { role: uppercaseRole }
    });
    res.json({ message: "User Role Changed" });
});

router.delete('/:id', auth, requireRole('SELLER'), async (req, res) => {
    const { id } = req.params;
    try {
        const userCart = await prisma.cart.findMany({
            where: { userId: id }
        })
        if (userCart.length > 0) {
            await Promise.all(userCart.map(async (cart) => {
                await prisma.cartItem.deleteMany({
                    where: { cartId: cart.id }
                })
            }))
        }
        await prisma.cart.deleteMany({
            where: { userId: id }
        })
        await prisma.user.delete({ where: { id } });
        res.json({ message: `user with ${id} and their data deleted successfully` });
    } catch (error) {
        console.log("Error Deleting user and is data")
        res.status(500).json({ error: "Cannot delete data" })
    }

});
module.exports = router;
