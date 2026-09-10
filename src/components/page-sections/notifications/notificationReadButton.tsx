import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useReadNotification } from "@/hooks/useNotification";
import { TNotificationApiResponse } from "@/types/api.response";

const NotificationReadButton = ({
  notification,
}: {
  notification: TNotificationApiResponse;
}) => {
  const { mutate, isPending } = useReadNotification();
  return (
    <Button
      variant="outline"
      size="sm"
      className="text-primary"
      onClick={() => mutate(notification.id)}
      disabled={isPending}
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Read"}
    </Button>
  );
};

export default NotificationReadButton;
