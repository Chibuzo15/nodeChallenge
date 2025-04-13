const express = require("express");
const router = express.Router();
const prisma = require("../../prisma/client");

// ✅ GET /api/clinics/:id/rooms
router.get("/:id/rooms", async (req, res) => {
  const clinicId = Number(req.params.id);
  const rooms = await prisma.clinicRoom.findMany({
    where: { clinicId },
    select: {
      roomName: true,
      roomNo: true,
      clinic: { select: { name: true } },
    },
  });
  res.json(
    rooms.map((room) => ({
      roomName: room.roomName,
      roomNo: room.roomNo,
      clinic: room.clinic.name,
    }))
  );
});

// ✅ POST /api/clinics/:id/rooms
router.post("/:id/rooms", async (req, res) => {
  const clinicId = Number(req.params.id);
  const { roomName, roomNo } = req.body;

  const room = await prisma.clinicRoom.create({
    data: { roomName, roomNo, clinicId },
  });

  res.status(201).json(room);
});

// 🔥 GET /api/clinics/:id/stats
router.get("/:id/stats", async (req, res) => {
  const clinicId = Number(req.params.id);
  const clinic = await prisma.clinic.findUnique({
    where: { id: clinicId },
    include: {
      appointments: true,
      rooms: true,
    },
  });

  if (!clinic) return res.status(404).json({ error: "Clinic not found" });

  const now = new Date();
  const upcomingAppointments = clinic.appointments.filter(
    (appt) => new Date(appt.appointmentTime) > now
  );

  res.json({
    clinicName: clinic.name,
    totalRooms: clinic.rooms.length,
    totalAppointments: clinic.appointments.length,
    upcomingAppointments: upcomingAppointments.length,
  });
});

// POST: Create room feature for a room
router.post("/:clinicId/rooms/:roomId/features", async (req, res) => {
  const clinicId = Number(req.params.clinicId);
  const roomId = Number(req.params.roomId);
  const { featureName } = req.body;

  if (!featureName) {
    return res.status(400).json({ error: "featureName is required" });
  }

  try {
    // Verify the room exists and belongs to the specified clinic
    const room = await prisma.clinicRoom.findFirst({
      where: {
        id: roomId,
        clinicId: clinicId,
      },
    });

    if (!room) {
      return res.status(404).json({ error: "Room not found in this clinic" });
    }

    // Create the feature
    const feature = await prisma.roomFeature.create({
      data: {
        featureName,
        roomId,
      },
    });

    res.status(201).json(feature);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create room feature" });
  }
});

//GET: get all room features by clinic id and clinicRoom id
router.get("/:clinicId/rooms/:roomId/features", async (req, res) => {
  const clinicId = Number(req.params.clinicId);
  const roomId = Number(req.params.roomId);

  try {
    const room = await prisma.clinicRoom.findFirst({
      where: {
        id: roomId,
        clinicId: clinicId,
      },
    });

    if (!room) {
      return res.status(404).json({ error: "Room not found in this clinic" });
    }

    // Get all features for this room
    const features = await prisma.roomFeature.findMany({
      where: {
        roomId,
      },
      select: {
        featureName: true,
        createdAt: true,
      },
    });

    res.json(features);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch room features" });
  }
});

//GET: get clinic summary by clinic id
router.get("/:clinicId/summary", async (req, res) => {
  const clinicId = Number(req.params.clinicId);

  try {
    // Get the clinic with all related data
    const clinic = await prisma.clinic.findUnique({
      where: {
        id: clinicId,
      },
      include: {
        rooms: {
          include: {
            features: true,
          },
        },
      },
    });

    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }

    // Calculate total feature count
    let totalFeatures = 0;
    const featuresMap = {};

    // Build the features object grouped by room name
    clinic.rooms.forEach((room) => {
      totalFeatures += room.features.length;

      featuresMap[room.roomName] = room.features.map(
        (feature) => feature.featureName
      );
    });

    // Build the summary response
    const summary = {
      clinicName: clinic.name,
      roomCount: clinic.rooms.length,
      featureCount: totalFeatures,
      features: featuresMap,
    };

    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate clinic summary" });
  }
});

module.exports = router;
