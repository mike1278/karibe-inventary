import { PrismaClient, Prisma } from '@prisma/client'
import { hashSync } from 'bcrypt'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Administrador',
    email: 'admin@gmail.com',
    username: 'admin',
    role: 'ADMIN',
    account: {
      create: {
        hash: hashSync('123456', 10)
      }
    }
  },
]

export async function seed() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

if (typeof require !== 'undefined' && require.main === module) {
  seed()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
