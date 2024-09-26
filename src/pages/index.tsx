import { IconPlus } from "@tabler/icons-react";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 items-center sm:items-start">
        <div className="flex justify-between my-auto">
          <span className="text-2xl font-bold text-slate-900">Timesheet</span>
          <Button>
            <IconPlus size={18} stroke={2} />
            <span className="pl-2">Add</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
