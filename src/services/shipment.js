/* eslint-disable no-useless-catch */
import Author from "../services/baseApi/AuthorApi";
const size = 5;

export const getShipmentByCourierId = async (id, page) => {
  try {
    const res = await Author.get(
      `/shipment-details/${id}?size=${size}&page=${page}`
    );
    return res;
  } catch (error) {
    console.log("Error get shipment by id : " + error);
    throw error;
  }
};

export const createOrderForShipper = async (order) => {
  try {
    const res = await Author.post("/shipments", order);
    return res;
  } catch (error) {
    throw error;
  }
};
