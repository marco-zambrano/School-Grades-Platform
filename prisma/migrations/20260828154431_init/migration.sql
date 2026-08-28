-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SchoolYear" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teacherId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SchoolYear_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "schoolYearId" TEXT NOT NULL,
    "gradeLabel" TEXT NOT NULL,
    "parallel" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Course_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "SchoolYear" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    CONSTRAINT "Student_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TrimesterGradebook" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    CONSTRAINT "TrimesterGradebook_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubjectGradebook" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trimesterId" TEXT NOT NULL,
    "subjectCode" TEXT NOT NULL,
    CONSTRAINT "SubjectGradebook_trimesterId_fkey" FOREIGN KEY ("trimesterId") REFERENCES "TrimesterGradebook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subjectGradebookId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Activity_subjectGradebookId_fkey" FOREIGN KEY ("subjectGradebookId") REFERENCES "SubjectGradebook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activityId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "value" REAL NOT NULL,
    CONSTRAINT "Grade_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Grade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolYear_teacherId_label_key" ON "SchoolYear"("teacherId", "label");

-- CreateIndex
CREATE UNIQUE INDEX "Course_schoolYearId_gradeLabel_parallel_key" ON "Course"("schoolYearId", "gradeLabel", "parallel");

-- CreateIndex
CREATE UNIQUE INDEX "TrimesterGradebook_courseId_number_key" ON "TrimesterGradebook"("courseId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectGradebook_trimesterId_subjectCode_key" ON "SubjectGradebook"("trimesterId", "subjectCode");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_activityId_studentId_key" ON "Grade"("activityId", "studentId");
