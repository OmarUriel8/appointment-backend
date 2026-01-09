import { User } from '@/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index(['employee', 'dayOfWeek'], { unique: true })
@Entity({
  name: 'employee_schedule',
})
export class EmployeeSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // lunes = 0, Domingo=6
  @Column({
    type: 'int',
  })
  dayOfWeek: number;

  @Column({
    type: 'time',
  })
  startTime: string;

  @Column({
    type: 'time',
  })
  endTime: string;

  @Column({ type: 'bool', default: true })
  isActive: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    select: false,
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.employeeSchedule)
  employee: User;
}
