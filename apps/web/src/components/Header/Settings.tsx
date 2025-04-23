import { useEffect, useState } from "react";
import _ from "lodash";
import { Settings } from "lucide-react";

import type { LayoutItem } from "@acme/lib/settings/index";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";

import { useSettings } from "../contexts/settingsContext";

function SettingsPopover({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const {
    settings: { layout },
  } = useSettings();
  const [localLayout, setLocalLayout] = useState(layout);

  useEffect(() => {
    setLocalLayout(layout);
  }, [layout]);

  const addLayout = (path: string, to: "row" | "col") => {
    setLocalLayout((localLayout) => {
      const spitedItem = _.get(localLayout, path) as LayoutItem;
      console.log(localLayout, path, to, spitedItem);
      _.set(localLayout, path, {
        percentage: spitedItem.percentage,
        [to]: [{ ...spitedItem, percentage: 50 }, { component: "empty", percentage: 50 } as LayoutItem],
      } as LayoutItem);
      console.log(localLayout, path, to, _.get(localLayout, path));
      return _.cloneDeep(localLayout);
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={className} asChild>
        <button className="flex items-center transition-colors hover:text-primary focus:outline-none" aria-label="Open settings">
          <Settings className={cn("h-[1.2rem] w-[1.2rem] transform transition-transform duration-300", open && "rotate-180")} />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="mt-2 flex min-h-[500px] min-w-[800px] rounded-lg p-4">
        {/* <pre>{JSON.stringify(layout, null, 2)}</pre> */}
        <div className="w-full">
          <LayoutDisplay item={localLayout} addLayout={addLayout} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface LayoutDisplayProps {
  item: LayoutItem;
  path?: string[];
  addLayout: (path: string, to: "row" | "col") => void;
}
const LayoutDisplay: React.FC<LayoutDisplayProps> = ({ addLayout, item, path = [] }) => {
  const displayPath = path.join(".");

  if (item.component) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded border p-2">
        {/* <span>{displayPath}</span> */}
        <span>{item.component}</span>
        <span>{item.percentage}</span>
        <div className="space-x-1">
          <Button size={"icon"} variant="outline" onClick={() => addLayout(displayPath, "row")}>
            H
          </Button>
          <Button size={"icon"} variant="outline" onClick={() => addLayout(displayPath, "col")}>
            V
          </Button>
        </div>
      </div>
    );
  }

  if (item.row) {
    return (
      <div className="flex h-full w-full gap-1 rounded border border-dashed">
        {item.row.map((child, index) => (
          <div key={`row-${index}`} className="flex-1">
            <LayoutDisplay item={child} path={[...path, `row[${index}]`]} addLayout={addLayout} />
          </div>
        ))}
      </div>
    );
  }

  if (item.col) {
    return (
      <div className="flex h-full w-full flex-1 flex-col gap-1 rounded border border-dashed">
        {item.col.map((child, index) => (
          <div key={`col-${index}`} className="flex-1">
            <LayoutDisplay item={child} path={[...path, `col[${index}]`]} addLayout={addLayout} />
          </div>
        ))}
      </div>
    );
  }

  return null;
};
export default SettingsPopover;
