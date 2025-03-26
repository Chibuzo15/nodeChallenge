# 🧪 Node.js + Prisma Candidate Challenge

Welcome to your backend developer challenge.

You’ll work in an already-functioning Node.js + Prisma backend. This test is designed to evaluate your ability to model data, fix bugs, write expressive APIs, and think asynchronously.

---

## ✅ What’s Already Working

- SQLite DB (created via Prisma)
- `Clinic`, `ClinicRoom`, and `Appointment` models
- Seed script that creates one sample clinic with rooms & appointments
- Express server running at `http://localhost:3000`
- Working APIs:
  - `GET /api/clinics/:id/rooms`
  - `GET /api/clinics/:id/stats`

---

## 🧩 Your Tasks

### 🔹 1. [Modeling] Add a new table: `roomFeatures`
Each room can have multiple features.
it must relate to the clinic room
featureName must be string
and a createdAt field must be added

### 🔹2. [API] Implement Two Endpoints in routes/clinics.js
POST /api/clinics/:clinicId/rooms/:roomId/features
{ "featureName": "Wheelchair Accessible" }
This should create a room feature for the room
It can be many
'featureName' is a required field. test it fail and return an error if it is not sent


GET /api/clinics/:clinicId/rooms/:roomId/features
[
  { "featureName": "TV", "createdAt": "2024-03-26T..." },
  { "featureName": "Oxygen" }
]

If needed RUN npx prisma studio to view the DB

### List all the rooms (issue)
Try to list all the rooms and see if there is an issue

### Create a new API to return clinic summary
api/clinics/:clinicId/summary
this must return 
{
    "clinicName": Name of the clinic,
    "roomCount": total number of rooms,
    "featureCount": total features,
    "features": {
        "Room A": [
            "feature 1",
            "feature 2",
            "feature 3"
        ],
        "Room B": [
            "feature 4",
        ]
    }
}

