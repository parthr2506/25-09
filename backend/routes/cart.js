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
    let updatedProduct;

    try {
        await prisma.$transaction(async (tx) => {
            const product = await tx.product.findUnique({
                where: { id: productId },
            });

            if (!product || product.stock < quantity) {
                return res.status(400).json({ error: 'Not enough stock for this product.' });
            }

            updatedProduct = await tx.product.update({
                where: { id: productId },
                data: {
                    stock: {
                        decrement: quantity,
                    },
                },
            });

            let userCart = await tx.cart.findFirst({
                where: { userId: req.user.id },
            });

            if (!userCart) {
                userCart = await tx.cart.create({
                    data: { userId: req.user.id },
                });
            }

            const existingItem = await tx.cartItem.findFirst({
                where: {
                    cartId: userCart.id,
                    productId,
                },
            });

            if (existingItem) {
                await tx.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: { increment: quantity } },
                });
            } else {
                await tx.cartItem.create({
                    data: {
                        cartId: userCart.id,
                        productId,
                        quantity,
                    },
                });
            }
        });

        res.status(200).json({ message: 'Item added to cart successfully', updatedProduct });
    } catch (error) {
        console.error("Error while adding the item to cart", error);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
});
router.post('/delete', auth, async (req, res) => {
    const { id } = req.body;

    try {
        const cartItem = await prisma.cartItem.findUnique({
            where: { id },
            include: { cart: true }
        });

        if (!cartItem || cartItem.cart.userId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to remove this item' });
        }
        await prisma.product.update({
            where: { id: cartItem.productId },
            data: { stock: { increment: cartItem.quantity } }

        })
        await prisma.cartItem.delete({ where: { id } });
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
