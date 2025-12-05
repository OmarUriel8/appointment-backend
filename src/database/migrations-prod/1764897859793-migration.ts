import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764897859793 implements MigrationInterface {
    name = 'Migration1764897859793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "employee_schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dayOfWeek" integer NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "employeeId" uuid, CONSTRAINT "PK_6d849e34b04c104b4c76b92fccf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c980c0d86b6b524b93e737d2df" ON "employee_schedule" ("employeeId", "dayOfWeek") `);
        await queryRunner.query(`CREATE TABLE "service" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text NOT NULL, "slug" text NOT NULL, "price" double precision NOT NULL, "durationMinutes" integer NOT NULL DEFAULT '30', "tags" text array NOT NULL DEFAULT '{}', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_7806a14d42c3244064b4a1706ca" UNIQUE ("name"), CONSTRAINT "UQ_4df47ef659e04d5be78ddb6b598" UNIQUE ("slug"), CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "service_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" text NOT NULL, "serviceId" uuid, CONSTRAINT "PK_25c780834f7ebf269233974cc8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."appointment_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "appointment" ("id" SERIAL NOT NULL, "date" date NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "status" "public"."appointment_status_enum" NOT NULL DEFAULT 'PENDING', "notes" text NOT NULL DEFAULT '', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "clientId" uuid, "employeeId" uuid, "serviceId" uuid, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('ADMIN', 'EMPLOYEE', 'CLIENT')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL DEFAULT '', "email" text NOT NULL, "phone" text, "password" text NOT NULL, "role" "public"."user_role_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "employee_schedule" ADD CONSTRAINT "FK_00fda0dea152ca01567aa51a151" FOREIGN KEY ("employeeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service_image" ADD CONSTRAINT "FK_fcec9d53526e892907f95ea1cfb" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_60ac979e3cb15127f2221e3b66d" FOREIGN KEY ("clientId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_b6e57758a28acd843878b1f30d8" FOREIGN KEY ("employeeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_cee8b55c31f700609674da96b0b" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_cee8b55c31f700609674da96b0b"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_b6e57758a28acd843878b1f30d8"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_60ac979e3cb15127f2221e3b66d"`);
        await queryRunner.query(`ALTER TABLE "service_image" DROP CONSTRAINT "FK_fcec9d53526e892907f95ea1cfb"`);
        await queryRunner.query(`ALTER TABLE "employee_schedule" DROP CONSTRAINT "FK_00fda0dea152ca01567aa51a151"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "appointment"`);
        await queryRunner.query(`DROP TYPE "public"."appointment_status_enum"`);
        await queryRunner.query(`DROP TABLE "service_image"`);
        await queryRunner.query(`DROP TABLE "service"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c980c0d86b6b524b93e737d2df"`);
        await queryRunner.query(`DROP TABLE "employee_schedule"`);
    }

}
