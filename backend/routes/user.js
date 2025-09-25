const express = require('express');
const prisma = require('../prisma/prismaClient');
const { auth, requireRole } = require('../middlewares/auth');
const router = express.Router();
router.get('/', auth, requireRole('admin'), async (req, res) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,

        }
    });
    res.json(users);
});
router.post('/assign-role', auth, requireRole('admin'), async (req, res) => {
    const { userId, role } = req.body;
    if (!['user', 'admin'].includes(role))
        return res.status(400).json({ error: 'Invalid role' });
    await prisma.user.update({
        where:
            { id: userId },
        data: { role }
    });
    res.json({ ok: true });
});
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ ok: true });
});
module.exports = router;
