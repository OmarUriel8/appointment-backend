import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1766080005883 implements MigrationInterface {
    name = 'Migration1766080005883'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" ADD "price" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "price"`);
    }

}
