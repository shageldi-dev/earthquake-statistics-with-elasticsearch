import { DashbordService } from "../../service/dashboard";
import { useQuery } from "react-query";
import { FilterDashboard } from "../../types/state";

const getData = async (state: FilterDashboard) => {
  const data = await DashbordService.getDashboard(state);
  return data;
};

const useGetDashboard = (state: FilterDashboard) => {
  return useQuery(["dashboard"], () => getData(state));
};

export default useGetDashboard;
