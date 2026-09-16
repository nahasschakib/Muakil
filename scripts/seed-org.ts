import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const db = new PrismaClient({ adapter })

async function main() {
  const org = await db.organization.upsert({
    where: { clerkOrgId: 'org_3JPEsdc8rKLrWXT0pRB6xnaE0lr' },
    create: {
      clerkOrgId: 'org_3JPEsdc8rKLrWXT0pRB6xnaE0lr',
      name: 'Cabinet Test Muakil',
      plan: 'STARTER',
    },
    update: {},
  })
  console.log('✅ Org upserted:', org)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
