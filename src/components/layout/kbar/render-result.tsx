import { KBarResults, useMatches } from "kbar";
import ResultItem from "./result-item";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

export default function RenderResults() {
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) => {
        console.log(item);
        const Icon =
          typeof item === "string"
            ? Icons.logo
            : Icons[(item as any).icon as keyof typeof Icons];

        return typeof item === "string" ? (
          <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {item}
          </div>
        ) : (
          <div
            className={cn(
              `flex items-center  gap-3 px-4 py-3 rounded-md cursor-pointer hover:bg-primary hover:text-white`,
              active && "bg-primary text-white"
            )}
          >
            {item.icon ? <Icon /> : <Icons.logo />}
            <span className="flex-1 text-sm font-medium">{item.name}</span>
          </div>
        );
      }}
    />
  );
}
