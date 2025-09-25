const express = require('express');
const prisma = require('../prisma/prismaClient');
const { auth } = require('../middlewares/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const userCart = await prisma.cart.findFirst({
            where: {
                userId: req.user.id
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!userCart) {
            return res.json([]);
        }

        res.json(userCart.items);
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ error: 'Failed to retrieve cart items' });
    }
});

router.post('/add', auth, async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    try {
        let userCart = await prisma.cart.findFirst({
            where: { userId: req.user.id }
        });

        if (!userCart) {
            userCart = await prisma.cart.create({
                data: { userId: req.user.id }
            });
        }

        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: userCart.id,
                productId
            }
        });

        if (existingItem) {
            const updatedItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + Number(quantity) }
            });
            return res.json(updatedItem);
        } else {
            const newItem = await prisma.cartItem.create({
                data: {
                    cartId: userCart.id,
                    productId,
                    quantity: Number(quantity)
                }
            });
            return res.json(newItem);
        }
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
});

router.post('/remove', auth, async (req, res) => {
    const { cartItemId } = req.body;

    try {
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: { cart: true }
        });

        if (!cartItem || cartItem.cart.userId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to remove this item' });
        }

        await prisma.cartItem.delete({ where: { id: cartItemId } });
        res.json({ message: 'Item removed successfully' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'item not found' });
        }
        console.error("Error removing item from cart:", error);
        res.status(500).json({ error: 'Failed to remove item' });
    }
});

module.exports = router;
