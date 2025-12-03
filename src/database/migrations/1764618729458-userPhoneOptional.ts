import { MigrationInterface, QueryRunner } from "typeorm";

export class UserPhoneOptional1764618729458 implements MigrationInterface {
    name = 'UserPhoneOptional1764618729458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phone" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phone" SET NOT NULL`);
    }

}
