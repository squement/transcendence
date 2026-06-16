-- CreateTable
CREATE TABLE "TestConfig" (
    "id" SERIAL NOT NULL,
    "back" INTEGER NOT NULL DEFAULT 0,
    "front" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TestConfig_pkey" PRIMARY KEY ("id")
);
