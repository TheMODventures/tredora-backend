-- CreateEnum
CREATE TYPE "public"."FieldType" AS ENUM ('TEXT', 'TEXTAREA', 'NUMBER', 'EMAIL', 'DATE', 'CHECKBOX', 'RADIO', 'SELECT', 'FILE', 'PASSWORD', 'URL', 'TEL');

-- CreateEnum
CREATE TYPE "public"."ValidationRuleType" AS ENUM ('REQUIRED', 'MIN_LENGTH', 'MAX_LENGTH', 'MIN', 'MAX', 'PATTERN', 'EMAIL', 'URL', 'CUSTOM');

-- CreateTable
CREATE TABLE "public"."form_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."form_fields" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "fieldType" "public"."FieldType" NOT NULL,
    "placeholder" TEXT,
    "defaultValue" TEXT,
    "answer" TEXT,
    "helpText" TEXT,
    "order" INTEGER NOT NULL,
    "width" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "templateId" TEXT NOT NULL,

    CONSTRAINT "form_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."field_options" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fieldId" TEXT NOT NULL,

    CONSTRAINT "field_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."field_validations" (
    "id" TEXT NOT NULL,
    "ruleType" "public"."ValidationRuleType" NOT NULL,
    "value" TEXT,
    "errorMessage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fieldId" TEXT NOT NULL,

    CONSTRAINT "field_validations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."form_fields" ADD CONSTRAINT "form_fields_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."form_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."field_options" ADD CONSTRAINT "field_options_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "public"."form_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."field_validations" ADD CONSTRAINT "field_validations_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "public"."form_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
