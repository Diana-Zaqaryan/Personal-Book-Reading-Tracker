import { useQuery } from "@tanstack/react-query";
import { getBookStatuses } from "../service/http.ts";
import { Status } from "../type/type.ts";

export function useStatuses() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["statuses"],
    queryFn: async () => {
      console.log("useQuery executing getStatuses");
      return await getBookStatuses();
    },
    staleTime: 6 * 1000,
    select: (data) => data as unknown as Status[],
  });

  return { data, isLoading, error };
}
