const express = require('express');
const router = express.Router();
const prisma = require('../../prisma/client');

// ✅ GET /api/clinics/:id/rooms
router.get('/:id/rooms', async (req, res) => {
  const clinicId = Number(req.params.id);
  const rooms = prisma.clinicRoom.findMany({
    where: { clinicId },
    select: {
      roomName: true,
      roomNo: true,
      clinic: { select: { name: true } }
    }
  });
  res.json(rooms.map(room => ({
    roomName: room.roomName,
    roomNo: room.roomNo,
    clinic: room.clinic.name
  })));
});

// ✅ POST /api/clinics/:id/rooms
router.post('/:id/rooms', async (req, res) => {
  const clinicId = Number(req.params.id);
  const { roomName, roomNo } = req.body;

  const room = await prisma.clinicRoom.create({
    data: { roomName, roomNo, clinicId }
  });

  res.status(201).json(room);
});

// 🔥 GET /api/clinics/:id/stats
router.get('/:id/stats', async (req, res) => {
  const clinicId = Number(req.params.id);
  const clinic = await prisma.clinic.findUnique({
    where: { id: clinicId },
    include: {
      appointments: true,
      rooms: true
    }
  });

  if (!clinic) return res.status(404).json({ error: "Clinic not found" });

  const now = new Date();
  const upcomingAppointments = clinic.appointments.filter(
    appt => new Date(appt.appointmentTime) > now
  );

  res.json({
    clinicName: clinic.name,
    totalRooms: clinic.rooms.length,
    totalAppointments: clinic.appointments.length,
    upcomingAppointments: upcomingAppointments.length
  });
});

module.exports = router;
