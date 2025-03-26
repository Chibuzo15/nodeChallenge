const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const clinic = await prisma.clinic.create({
    data: {
      name: "Sunrise Health",
      address: "123 Health St",
      phone: "1234567890"
    }
  });

  await prisma.clinicRoom.createMany({
    data: [
      { roomName: "Room A", roomNo: 101, clinicId: clinic.id },
      { roomName: "Room B", roomNo: 102, clinicId: clinic.id }
    ]
  });

  await prisma.appointment.createMany({
    data: [
      {
        clinicId: clinic.id,
        patientName: "John Doe",
        appointmentTime: new Date(Date.now() + 3600 * 1000)
      },
      {
        clinicId: clinic.id,
        patientName: "Jane Smith",
        appointmentTime: new Date(Date.now() + 2 * 3600 * 1000)
      }
    ]
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
