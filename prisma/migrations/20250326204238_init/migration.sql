-- CreateTable
CREATE TABLE "Clinic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT
);

-- CreateTable
CREATE TABLE "ClinicRoom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roomName" TEXT NOT NULL,
    "roomNo" INTEGER NOT NULL,
    "clinicId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClinicRoom_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clinicId" INTEGER NOT NULL,
    "patientName" TEXT NOT NULL,
    "appointmentTime" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Appointment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
