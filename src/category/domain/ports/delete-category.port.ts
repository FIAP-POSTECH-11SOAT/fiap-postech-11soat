export type DeleteCategoryInput = {
  id: string;
};

export abstract class DeleteCategoryPort {
  abstract execute({ id }: DeleteCategoryInput): Promise<void>;
}
