import { Button } from "@/components/ui/button";
import { Globe, Text, Upload } from "lucide-react";

function QuickActions({ onOpenModal }: { onOpenModal: (tab: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Button
        variant="outline"
        onClick={() => onOpenModal("website")}
        className="h-auto py-8 px-6 flex flex-col items-center justify-center gap-4 dark:border-white/5 border-zinc-200 dark:bg-[#0A0A0E] bg-white dark:hover:bg-white/2 hover:bg-zinc-50 hover:border-indigo-500/30 transition-all dark:hover:text-white hover:text-zinc-900 group whitespace-normal"
      >
        <div className="p-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
          <Globe className="w-6 h-6 text-indigo-400" />
        </div>

        <div className="space-y-1.5 text-center w-full">
          <span className="text-sm font-medium block whitespace-normal">
            Add Website
          </span>
          <p className="text-xs text-zinc-500 font-normal leading-relaxed whitespace-normal wrap-break-word ">
            crawl and extract content from your website to build your knowledge
            base.
          </p>
        </div>
      </Button>
      <Button
        variant="outline"
        onClick={() => onOpenModal("upload")}
        className="h-auto py-8 px-6 flex flex-col items-center justify-center gap-4 dark:border-white/5 border-zinc-200 dark:bg-[#0A0A0E] bg-white dark:hover:bg-white/2 hover:bg-zinc-50 hover:border-green-500/30 transition-all dark:hover:text-white hover:text-zinc-900 group whitespace-normal"
      >
        <div className="p-3 rounded-full bg-green-500/10 border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
          <Upload className="w-6 h-6 text-green-400" />
        </div>

        <div className="space-y-1.5 text-center w-full">
          <span className="text-sm font-medium block whitespace-normal">
            Upload CSV
          </span>
          <p className="text-xs text-zinc-500 font-normal leading-relaxed whitespace-normal wrap-break-word">
            Import data from a CSV file to build your knowledge base.
          </p>
        </div>
      </Button>
      <Button
        variant="outline"
        onClick={() => onOpenModal("plaintext")}
        className="h-auto py-8 px-6 flex flex-col items-center justify-center gap-4 dark:border-white/5 border-zinc-200 dark:bg-[#0A0A0E] bg-white dark:hover:bg-white/2 hover:bg-zinc-50 hover:border-purple-500/30 transition-all dark:hover:text-white hover:text-zinc-900 group whitespace-normal"
      >
        <div className="p-3 rounded-full bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
          <Text className="w-6 h-6 text-purple-400" />
        </div>

        <div className="space-y-1.5 text-center w-full">
          <span className="text-sm font-medium block whitespace-normal">
            Plain Text
          </span>
          <p className="text-xs text-zinc-500 font-normal leading-relaxed whitespace-normal wrap-break-word">
            Add plain text content to build your knowledge base.
          </p>
        </div>
      </Button>
    </div>
  );
}

export default QuickActions;
