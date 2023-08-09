import { useQuery } from "react-query";
import PlaceService from "../../service/place";
import { PlacesFilter } from "../../types/places";

const getData = async (params: PlacesFilter) => {
  const result = await new PlaceService().getAllPlaces(params);
  return result.data;
};

export const useGetPlaces = (params: PlacesFilter) => {
  return useQuery(["places"], () => getData(params));
};
