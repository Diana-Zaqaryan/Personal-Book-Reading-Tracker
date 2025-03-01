import { useQuery } from "@tanstack/react-query";
import { getBookById } from "../service/http.ts";
import { Book } from "../type/type.ts";

export function useBook(id: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["book"],
    queryFn: async () => {
      return await getBookById(id);
    },
    select: (data) => data as Book,
  });

  return { data, isLoading, error };
}
