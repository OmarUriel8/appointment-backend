import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764780398369 implements MigrationInterface {
    name = 'Migration1764780398369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_schedule" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_schedule" DROP COLUMN "isActive"`);
    }

}
