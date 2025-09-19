import { Category } from "@/lib/types";

/**
 * Получает все корневые категории (без родителя)
 */
export const getRootCategories = (categories: Category[]): Category[] => {
  return categories.filter((category) => !category.parent);
};

/**
 * Получает дочерние категории для указанной родительской категории
 */
export const getChildCategories = (
  categories: Category[],
  parentId: number
): Category[] => {
  return categories.filter((category) => category.parent?.id === parentId);
};

/**
 * Получает все категории в виде дерева (иерархическая структура)
 */
export const getCategoriesTree = (categories: Category[]): Category[] => {
  const rootCategories = getRootCategories(categories);
  const processedIds = new Set<number>();

  const buildTree = (parentCategories: Category[]): Category[] => {
    return parentCategories.map((category) => {
      // Предотвращаем циклические ссылки
      if (processedIds.has(category.id)) {
        return { ...category, children: undefined };
      }

      processedIds.add(category.id);

      const childCategories = getChildCategories(categories, category.id);
      const children =
        childCategories.length > 0 ? buildTree(childCategories) : undefined;

      return {
        ...category,
        children,
      };
    });
  };

  return buildTree(rootCategories);
};

/**
 * Получает путь к категории (массив всех родительских категорий)
 */
export const getCategoryPath = (
  categories: Category[],
  categoryId: number
): Category[] => {
  const category = categories.find((cat) => cat.id === categoryId);
  if (!category) return [];

  const path: Category[] = [];
  const visitedIds = new Set<number>();
  let currentCategory = category;

  while (currentCategory && !visitedIds.has(currentCategory.id)) {
    visitedIds.add(currentCategory.id);
    path.unshift(currentCategory);

    if (currentCategory.parent) {
      const parentCategory = categories.find(
        (cat) => cat.id === currentCategory.parent!.id
      );
      currentCategory = parentCategory || (null as any);
    } else {
      currentCategory = null as any;
    }
  }

  return path;
};

/**
 * Получает все листовые категории (без дочерних)
 */
export const getLeafCategories = (categories: Category[]): Category[] => {
  return categories.filter((category) => {
    const hasChildren = categories.some(
      (cat) => cat.parent?.id === category.id
    );
    return !hasChildren;
  });
};

/**
 * Проверяет, является ли категория дочерней для указанной родительской
 */
export const isChildOf = (
  categories: Category[],
  childId: number,
  parentId: number
): boolean => {
  const path = getCategoryPath(categories, childId);
  return path.some((category) => category.id === parentId);
};

/**
 * Получает все продукты, которые принадлежат категории или её дочерним категориям
 */
export const getCategoryWithAllChildren = (
  categories: Category[],
  categoryId: number
): Category[] => {
  const result: Category[] = [];
  const processedIds = new Set<number>();

  const collectCategories = (id: number) => {
    if (processedIds.has(id)) return;

    const category = categories.find((cat) => cat.id === id);
    if (!category) return;

    processedIds.add(id);
    result.push(category);

    const children = getChildCategories(categories, id);
    children.forEach((child) => {
      collectCategories(child.id);
    });
  };

  collectCategories(categoryId);
  return result;
};

/**
 * Сортирует категории по иерархии и порядку
 */
export const sortCategoriesByHierarchy = (
  categories: Category[]
): Category[] => {
  const sorted: Category[] = [];
  const processed = new Set<number>();

  const addCategory = (category: Category) => {
    if (processed.has(category.id)) return;

    // Сначала добавляем родительскую категорию, если она есть
    if (category.parent && !processed.has(category.parent.id)) {
      const parent = categories.find((cat) => cat.id === category.parent!.id);
      if (parent) {
        addCategory(parent);
      }
    }

    sorted.push(category);
    processed.add(category.id);

    // Затем добавляем дочерние категории
    const children = getChildCategories(categories, category.id).sort(
      (a, b) => a.order - b.order
    );

    children.forEach(addCategory);
  };

  // Начинаем с корневых категорий, отсортированных по порядку
  const rootCategories = getRootCategories(categories).sort(
    (a, b) => a.order - b.order
  );

  rootCategories.forEach(addCategory);

  return sorted;
};
