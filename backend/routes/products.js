const express = require('express');
const prisma = require('../prisma/prismaClient');
const { auth, requireRole } = require('../middlewares/auth');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { query } = req.query;
        const whereClause = query ? {
            name: {
                contains: query,
                mode: 'insensitive'
            }
        } : {}
        const products = await prisma.product.findMany({
            where: whereClause,
            // orderBy: { createdAt: 'desc' }
        });
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: 'Failed to find products' });
    }
});

router.post('/', auth, requireRole('SELLER'), async (req, res) => {
    const { name, description, price, stock, images } = req.body;

    if (!name || !description || !price || stock === undefined || !images) {
        return res.status(400).json({ error: 'Please provide all details.' });
    }

    try {
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: Number(price),
                stock: Number(stock),
                images,
                sellerId: req.user.id,
            }
        });
        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});
router.delete('/:id', auth, requireRole('SELLER'), async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({ where: { id } });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.sellerId !== req.user.id) {
            return res.status(403).json({ error: 'Not Allowed' });
        }

        await prisma.cartItem.deleteMany({
            where: { productId: id }
        });

        await prisma.product.delete({ where: { id } });
        res.json({ message: `Product with ID ${id} deleted successfully.` });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Product not found' });
        }
        console.error("Error deleting product:", error);
        res.status(500).json({ error: 'Cannot delete product' });
    }
});

router.put('/:id/stock', auth, async (req, res) => {
    const { id } = req.params;
    const { stock } = req.body
    try {
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: { stock: Number(stock) }
        })
        res.status(200).json(updatedProduct)
    } catch (error) {
        console.log("error while updating product");
        res.status(500).json({ error: "update product failed" })

    }
})

module.exports = router;
