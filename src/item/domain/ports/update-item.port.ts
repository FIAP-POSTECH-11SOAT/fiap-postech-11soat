import { CreateItemProps, Item } from '../item.entity';

export type UpdateItemProps = Partial<
  Omit<CreateItemProps, 'id' | 'deletedAt' | 'createdAt' | 'updatedAt'>
>;
export abstract class UpdateItemPort {
  abstract execute(id: string, updateItem: UpdateItemProps): Promise<Item>;
}
