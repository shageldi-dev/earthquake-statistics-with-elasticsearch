import { useMutation, useQueryClient } from "react-query";
import PlaceService from "../../service/place";
import { message } from "antd";

const deleteItem = async (id: string) => {
  return await new PlaceService().deleteItem(id);
};

export const useDeletePlace = () => {
  const client = useQueryClient();
  return useMutation(deleteItem, {
    onSuccess: () => {
      setTimeout(() => {
        client.invalidateQueries(["places"]);
      }, 1000);
      message.success("Successfully deleted!");
    },
    onError: () => {
      message.error("Failed to delete!");
    },
  });
};
