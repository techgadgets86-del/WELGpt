import { PrismaClient } from '/Volumes/Untitled 3/TK APPs/DILSEV/dilsev-webapp/node_modules/@prisma/client/default.js';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'mysql://u619945738_dilsevusr:DilSev_DB_2026!@@srv1768.hstgr.io:3306/u619945738_dilsevdb',
    },
  },
});

async function main() {
  try {
    const [userCount, waitlistCount, conversationCount, messageCount] = await Promise.all([
      prisma.user.count(),
      prisma.waitlist.count(),
      prisma.conversation.count(),
      prisma.message.count(),
    ]);

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        xp: true,
        streak: true,
        lastActivity: true,
        createdAt: true,
      },
      orderBy: { xp: 'desc' },
      take: 20,
    });

    console.log(
      JSON.stringify({
        success: true,
        userCount,
        waitlistCount,
        conversationCount,
        messageCount,
        users,
      })
    );
  } catch (err) {
    console.error(JSON.stringify({ success: false, error: err.message }));
  } finally {
    await prisma.$disconnect();
  }
}

main();
