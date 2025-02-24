import { useQuery } from "@tanstack/react-query";
import { getBooks } from "../service/http.ts";
import { Book } from "../type/type.ts";

export function useBooks() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      return await getBooks();
    },
    staleTime: 6 * 1000000,
    select: (data) => data as Book[],
  });

  return { data, isLoading, error };
}
