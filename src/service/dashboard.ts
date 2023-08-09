import { axiosPublic } from "../common/axios.instance";
import { FilterDashboard } from "../types/state";

const getDashboard = async (state: FilterDashboard) => {
  try {
    let url = "/search";
    if (
      state.st &&
      state.st.trim().length > 0 &&
      state.en &&
      state.en.trim().length > 0
    ) {
      url += "?start_date=" + state.st + "&end_date=" + state.en;
    }

    if (state.search && state.search.trim().length > 0) {
      if (url.includes("?")) {
        url += "&";
      } else {
        url += "?";
      }
      url += "search=" + state.search;
    }
    const data = axiosPublic.get(url);
    return data;
  } catch (err) {
    throw err;
  }
};

const getGeoPoints = async (state: FilterDashboard) => {
  try {
    let url = "/search/earthquakes.geojson";
    if (
      state.st &&
      state.st.trim().length > 0 &&
      state.en &&
      state.en.trim().length > 0
    ) {
      url += "?start_date=" + state.st + "&end_date=" + state.en;
    }

    if (state.search && state.search.trim().length > 0) {
      if (url.includes("?")) {
        url += "&";
      } else {
        url += "?";
      }
      url += "search=" + state.search;
    }
    const data = axiosPublic.get(url);
    return data;
  } catch (err) {
    throw err;
  }
};

export const DashbordService = {
  getDashboard,
  getGeoPoints,
};
