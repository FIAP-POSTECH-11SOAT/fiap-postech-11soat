export abstract class CreateCategoryPort {
  abstract execute({ name }: { name: string }): Promise<void>;
}
