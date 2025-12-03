import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764712161057 implements MigrationInterface {
    name = 'Migration1764712161057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "employee_schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dayOfWeek" integer NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "employeeId" uuid, CONSTRAINT "PK_6d849e34b04c104b4c76b92fccf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c980c0d86b6b524b93e737d2df" ON "employee_schedule" ("employeeId", "dayOfWeek") `);
        await queryRunner.query(`ALTER TABLE "employee_schedule" ADD CONSTRAINT "FK_00fda0dea152ca01567aa51a151" FOREIGN KEY ("employeeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_schedule" DROP CONSTRAINT "FK_00fda0dea152ca01567aa51a151"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c980c0d86b6b524b93e737d2df"`);
        await queryRunner.query(`DROP TABLE "employee_schedule"`);
    }

}
