import { PrismaClient } from '@prisma/client';
import { ulid } from 'ulid';
import argon2 from 'argon2';

const prisma = new PrismaClient();

enum PersonGender {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  OTHERS = 'OTHERS',
}

enum PersonSuffix {
  MR = 'MR',
  MS = 'MS',
  MRS = 'MRS',
}

enum UserStatus {
  FOR_APPROVAL = 'FOR_APPROVAL',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DISAPPROVED = 'DISAPPROVED',
}

async function main() {
  const personId = ulid();
  const userId = ulid();

  const hashedPassword = await argon2.hash('123@abc#');

  const roles = [
    { roleId: ulid(), name: 'admin' },
    { roleId: ulid(), name: 'national' },
    { roleId: ulid(), name: 'planter' },
    { roleId: ulid(), name: 'mill_district_officer' },
    { roleId: ulid(), name: 'guest' },
  ];

  const organizations = [
    {
      organizationId: ulid(),
      name: 'LGU',
    },
    {
      organizationId: ulid(),
      name: 'NGO',
    },
    {
      organizationId: ulid(),
      name: 'LGU',
    },
    {
      organizationId: ulid(),
      name: 'Private Company',
    },
    {
      organizationId: ulid(),
      name: 'Academy',
    },
  ];

  const contactDetails = [
    { contactDetailsId: ulid(), name: 'email' },
    { contactDetailsId: ulid(), name: 'mobile_no' },
  ];

  const persons = [
    {
      personId,
      firstName: 'Admin',
      lastName: 'Administrator',
      roleId: roles[0].roleId,
      gender: PersonGender.MALE,
      suffix: PersonSuffix.MR,
    },
  ];

  const personContactDetails = [
    {
      personId,
      personContactDetailsId: ulid(),
      contactDetailsId: contactDetails[0].contactDetailsId,
      value: 'george@mybusybee.net',
    },
  ];

  const user = [
    {
      userId,
      personId,
      username: 'GeorgeBusyBee@123',
      password: hashedPassword,
      isActive: 1,
      roleId: roles[0].roleId,
      organizationId: organizations[0].organizationId,
      agency: 'Government Agency',
      status: UserStatus.APPROVED,
    },
  ];

  await prisma.$transaction(async (trx) => {
    await trx.role.createMany({
      data: roles,
    });

    await trx.organization.createMany({
      data: organizations,
    });

    await trx.contactDetails.createMany({
      data: contactDetails,
    });

    await trx.person.createMany({
      data: persons,
    });

    await trx.personContactDetails.createMany({
      data: personContactDetails,
    });

    await trx.user.createMany({ data: user });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
