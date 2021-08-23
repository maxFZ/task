import { BeforeInsert, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { FolderEntity } from './folder.entity';
import { hash } from 'bcrypt'



@Entity({ name: 'file' })
export class FileEntity {
	@PrimaryGeneratedColumn("uuid")
	id: number;

	@Column()
	name: string;

	@Column()
	parentDir: string;

	@Column()
	path: string

	@Index({ fulltext: true })
	@Column({ type: "text" })
	data: string

	@Column()
	hash: string

	@CreateDateColumn()
	createdAt: Date;


	@UpdateDateColumn()
	updatedAt: Date;
}







