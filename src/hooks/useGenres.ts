import { useQuery } from "@tanstack/react-query";
import { getGenres } from "../service/http.ts";
import { Genre } from "../type/type.ts";

export function useGenres() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      console.log("useQuery executing getGenres");
      return await getGenres();
    },
    staleTime: 6 * 1000,
    select: (data) => data as Genre[],
  });

  return { data, isLoading, error };
}
