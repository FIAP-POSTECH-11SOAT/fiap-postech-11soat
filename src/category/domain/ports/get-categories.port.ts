import { Category } from "../category.entity";

export abstract class GetCategoriesPort {
  abstract execute(): Promise<Category[]>;
}
