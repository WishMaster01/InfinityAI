import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const demoUser = {
  clerkId: "seed_community_creator",
  email: "creator@infinityai.demo",
  fullName: "InfinityAI Creator",
  imageUrl: "https://i.pravatar.cc/160?img=12",
};

const creations = [
  {
    prompt: "A cinematic sunrise over a floating glass city",
    content:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85",
  },
  {
    prompt: "A calm creative desk with neon light and notebooks",
    content:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=85",
  },
  {
    prompt: "A futuristic mountain landscape in a soft editorial style",
    content:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85",
  },
  {
    prompt: "Colorful abstract waves for a modern brand campaign",
    content:
      "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1200&q=85",
  },
];

const main = async () => {
  const user = await prisma.user.upsert({
    where: { clerkId: demoUser.clerkId },
    update: demoUser,
    create: demoUser,
  });
  for (const creation of creations) {
    const existing = await prisma.creation.findFirst({
      where: { userId: user.id, prompt: creation.prompt },
    });
    if (!existing)
      await prisma.creation.create({
        data: {
          ...creation,
          userId: user.id,
          type: "image",
          publish: true,
          likes: [],
        },
      });
  }
  console.log(
    `Seeded ${creations.length} community creations for ${user.fullName}.`,
  );
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
