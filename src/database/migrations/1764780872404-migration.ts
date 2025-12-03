import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764780872404 implements MigrationInterface {
    name = 'Migration1764780872404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_schedule" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "employee_schedule" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_schedule" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "employee_schedule" DROP COLUMN "createdAt"`);
    }

}
