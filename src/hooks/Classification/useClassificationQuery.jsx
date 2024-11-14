import { useQuery } from "@tanstack/react-query";
import {
  getAllCategory,
  getAllCategoryForProduct,
  getAllCategoryTrash,
  getAllClassification,
  getCategoryById,
} from "../../services/category";

const useClassificationQuery = (action, id, page) => {
  let queryKey;
  if (action === "GET_CLASSIFICATION_BY_ID") {
    queryKey = ["GET_CLASSIFICATION", page];
  } else {
    queryKey = id ? ["CATEGORY_KEY", id] : ["CATEGORY_KEY", page];
  }

  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: async () => {
      switch (action) {
        case "GET_ALL_CATEGORY":
          return await getAllCategory(page);
        case "GET_CATEGORY_BY_ID":
          return await getCategoryById(id);
        case "GET_ALL_CATEGORY_TRASH":
          return await getAllCategoryTrash(page);
        case "GET_ALL_CATEGORY_FOR_PRODUCT":
          return await getAllCategoryForProduct();
        case "GET_CLASSIFICATION_BY_ID":
          return await getAllClassification(id, page);
        default:
          return null;
      }
    },
  });
  return { data, ...rest };
};
export default useClassificationQuery;
