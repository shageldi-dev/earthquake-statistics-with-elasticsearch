import { PlacesFilter } from "../types/places";
import { axiosPublic } from "../common/axios.instance";

export default class PlaceService {
  async getAllPlaces(params: PlacesFilter) {
    let url = "/places";
    if (params.search) {
      url += `?search=${params.search}`;
    }
    if (params.limit) {
      if (!url.includes("?")) {
        url += "?";
      } else {
        url += "&";
      }
      url += `limit=${params.limit}`;
    }
    if (params.page) {
      if (!url.includes("?")) {
        url += "?";
      } else {
        url += "&";
      }
      url += `page=${params.page}`;
    }
    const data = await axiosPublic.get(url);
    return data;
  }

  async deleteItem(id: string) {
    return await axiosPublic.delete(`/places/${id}`);
  }
}
