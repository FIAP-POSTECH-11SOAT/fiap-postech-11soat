export interface UpdateCategoryInput {
  id: string;
  name: string;
};

export abstract class UpdateCategoryPort {
  abstract execute(input: UpdateCategoryInput): Promise<void>;
}
