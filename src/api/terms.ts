import axiosInstance from "@/utils/axios";
import { Services } from "@/constants/apiServices";
import { cleanParams } from "@/lib/utils";

export const getTermsForAction = async (
  token: string,
  params: {
    action_type: string;
    payment_option_id?: string | null;
    withdrawal_type_id?: string | null;
  },
) => {
  const cleaned = cleanParams({ ...params });
  const res = await axiosInstance(token).get(Services.TERMS, {
    params: cleaned,
  });
  return res.data;
};
