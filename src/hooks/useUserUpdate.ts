import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { updateUserBookList, updateUserData } from "../service/http.ts";

export default function useMutationUser() {
  const queryClient = useQueryClient();
  // const navigate = useNavigate()

  // const addMutation = useMutation({
  //     mutationKey: ['add contact'],
  //     mutationFn: addContact,
  //     onSuccess: () => {
  //         queryClient.invalidateQueries({ queryKey: ['contacts'] })
  //     },
  // })

  // const deleteMutation = useMutation({
  //     mutationKey: ['delete contact'],
  //     mutationFn: deleteContact,
  //     onSuccess: () => {
  //         queryClient.invalidateQueries({ queryKey: ['contacts'] })
  //         navigate(`/`)
  //     },
  // })

  const updateMutation = useMutation({
    mutationKey: ["update user"],
    mutationFn: (user) => updateUserBookList(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.refetchQueries({ queryKey: ["user"] });
    },
    onError: () => console.log("Errrrrrrooorrrr"),
  });

  return {
    updateUser: updateMutation.mutate,
  };
}
