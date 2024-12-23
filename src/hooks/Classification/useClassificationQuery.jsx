// import { useQuery } from "@tanstack/react-query";
// import {
//   getAllCategory,
//   getAllCategoryForProduct,
//   getAllCategoryTrash,
//   getAllClassification,
//   getCategoryById,
// } from "../../services/category";

// const useClassificationQuery = (action, id, page) => {
//   let queryKey = page
//     ? ["GET_CLASSIFICATION", page]
//     : ["GET_CLASSIFICATION", id];

//   const { data, ...rest } = useQuery({
//     queryKey,
//     queryFn: async () => {
//       switch (action) {
//         case "GET_ALL_CATEGORY":
//           return await getAllCategory(page);
//         case "GET_CATEGORY_BY_ID":
//           return await getCategoryById(id);
//         case "GET_ALL_CATEGORY_TRASH":
//           return await getAllCategoryTrash(page);
//         case "GET_ALL_CATEGORY_FOR_PRODUCT":
//           return await getAllCategoryForProduct();
//         case "GET_CLASSIFICATION_BY_ID":
//           return await getAllClassification(id, page);
//         default:
//           return null;
//       }
//     },
//   });
//   return { data, ...rest };
// };
// export default useClassificationQuery;
