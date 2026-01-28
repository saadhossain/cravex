import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOriginalPriceToMenuItem1769630913368 implements MigrationInterface {
    name = 'AddOriginalPriceToMenuItem1769630913368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" ADD "originalPrice" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "restaurants" DROP COLUMN "logoUrl"`);
        await queryRunner.query(`ALTER TABLE "restaurants" ADD "logoUrl" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurants" DROP COLUMN "logoUrl"`);
        await queryRunner.query(`ALTER TABLE "restaurants" ADD "logoUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "originalPrice"`);
    }

}
