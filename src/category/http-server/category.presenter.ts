import { Category } from "../domain/category.entity";

export class CategoryPresenter {
  static toHTTP(category: Category) {
    return {
      id: category.id,
      name: category.name,
    }
  }
}
