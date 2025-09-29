require('dotenv').config();
const prisma = require('./prisma/prismaClient');
const bcrypt = require('bcryptjs');

async function main() {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin@123';
    const existing = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (!existing) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                role: 'SELLER'
            }
        });
        // console.log(`Admin created: ${adminEmail} / ${adminPassword}`);
    } else {
        // console.log('Admin already exists');
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
