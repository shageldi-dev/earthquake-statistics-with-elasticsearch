import { useQuery } from "react-query";
import { DashbordService } from "../../service/dashboard";
import { FilterDashboard } from "../../types/state";
const getData = async (state: FilterDashboard) => {
  const data = await DashbordService.getGeoPoints(state);
  return data;
};

const useGetGeoPoints = (state: FilterDashboard) => {
  return useQuery(["geopints"], () => getData(state));
};

export default useGetGeoPoints;
