import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ServiceImage } from './service-image.entity';

@Entity({
  name: 'service',
})
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    unique: true,
  })
  name: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  @Column({
    type: 'float',
  })
  price: number;

  @Column({
    type: 'int',
    default: '30',
  })
  durationMinutes: number;

  @Column({
    type: 'text',
    array: true,
    default: [],
  })
  tags: string[];

  @Column({
    type: 'bool',
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => ServiceImage, (serviceImage) => serviceImage.service, {
    eager: true,
  })
  images?: ServiceImage[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    if (!this.slug) {
      this.slug = this.name
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '');
    }
  }

  @BeforeUpdate()
  checkfieldBeforeUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
