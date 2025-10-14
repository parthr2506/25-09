const express = require("express");
const prisma = require("../prisma/prismaClient");
const router = express.Router();

router.post("/add", async (req, res) => {
    try {
        const { userId, productId } = req.body;
        if (!userId || !productId)
            return res.status(400).json({ message: "Missing userId or productId" });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { watchlist: true },
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.watchlist.includes(productId))
            return res.json({ message: "Already in watchlist", watchlist: user.watchlist });

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { watchlist: { push: productId } },
        });

        res.json({ message: "Added to watchlist", watchlist: updatedUser.watchlist });
    } catch (err) {
        console.error("Error adding to watchlist:", err);
        res.status(500).json({ error: err.message });
    }
});


router.post("/remove", async (req, res) => {
    try {
        const { userId, productId } = req.body;
        if (!userId || !productId)
            return res.status(400).json({ message: "Missing userId or productId" });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { watchlist: true },
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        const updatedWatchlist = user.watchlist.filter((id) => id !== productId);

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { watchlist: updatedWatchlist },
        });

        res.json({ message: "Removed from watchlist", watchlist: updatedUser.watchlist });
    } catch (err) {
        console.error("Error removing from watchlist:", err);
        res.status(500).json({ error: err.message });
    }
});

router.get("/:userId", async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.userId },
            select: { watchlist: true },
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        const watchlistProducts = await prisma.product.findMany({
            where: { id: { in: user.watchlist } },
        });

        res.json({ watchlist: watchlistProducts });
    } catch (err) {
        console.error("Error fetching watchlist:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
