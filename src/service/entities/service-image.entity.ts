import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Service } from './service.entity';

@Entity({
  name: 'service_image',
})
export class ServiceImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
  })
  url: string;

  @ManyToOne(() => Service, (service) => service.images)
  service: Service;
}
