import { useQueryData } from "./useQueryData";
import { useSession } from "next-auth/react";
import { getTermsForAction } from "@/api/terms";
import { ITermsCondition } from "@/types/terms";

interface UseTermsParams {
  action_type: string;
  payment_option_id?: string | null;
  withdrawal_type_id?: string | null;
  enabled?: boolean;
}

export const useTermsForAction = ({
  action_type,
  payment_option_id,
  withdrawal_type_id,
  enabled = true,
}: UseTermsParams) => {
  const { data: session } = useSession();

  const { data, isPending, isFetched } = useQueryData(
    ["terms-client", action_type, payment_option_id ?? "", withdrawal_type_id ?? ""],
    () =>
      getTermsForAction(session?.user?.token as string, {
        action_type,
        payment_option_id,
        withdrawal_type_id,
      }),
    { enabled: enabled && !!action_type },
  );

  const terms = (data as ITermsCondition[]) ?? [];
  return { terms, isPending, isFetched };
};
