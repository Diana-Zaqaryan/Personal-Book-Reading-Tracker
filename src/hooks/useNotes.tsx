import { useQuery } from "@tanstack/react-query";
import { getNotes } from "../service/http.ts";
import { Note } from "../type/type.ts";

export function useNotes(userId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      return await getNotes(userId);
    },
    staleTime: 6 * 1000000,
    select: (data) => data as Note[],
  });

  return { data, isLoading, error };
}
