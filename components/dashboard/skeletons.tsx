export function DashboardSkeleton() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto md:ml-64">
      <div className="flex flex-col gap-2">
        <div className="h-3 w-24 dark:bg-zinc-800/60 bg-zinc-200/60 rounded animate-pulse" />
        <div className="h-8 w-80 dark:bg-zinc-800/60 bg-zinc-200/60 rounded-lg animate-pulse" />
        <div className="h-4 w-96 dark:bg-zinc-800/40 bg-zinc-200/40rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border dark:border-white/5 border-zinc-200 dark:bg-zinc-950/60 bg-white p-4 h-28 animate-pulse"
          />
        ))}
      </div>
      <div className="rounded-2xl border dark:border-white/5 border-zinc-200 dark:bg-zinc-950/70 bg-white p-5 h-48 animate-pulse" />
    </div>
  );
}

export function KnowledgeSkeleton() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto md:ml-64">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <div className="h-6 w-32 dark:bg-zinc-800/60 bg-zinc-200/60 rounded-lg animate-pulse" />
          <div className="h-4 w-56 dark:bg-zinc-800/40 bg-zinc-200/40rounded animate-pulse" />
        </div>
        <div className="h-9 w-36 dark:bg-zinc-800/60 bg-zinc-200/60 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-xl border dark:border-white/5 border-zinc-200 dark:bg-zinc-950/60 bg-white animate-pulse"
          />
        ))}
      </div>
      <div className="space-y-3">
        <div className="h-4 w-40 dark:bg-zinc-800/40 bg-zinc-200/40rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl border dark:border-white/5 border-zinc-200 dark:bg-zinc-950/60 bg-white animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ConversationsSkeleton() {
  return (
    <div className="p-4 md:p-6 md:ml-64 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col gap-2">
        <div className="h-7 w-44 dark:bg-zinc-800/60 bg-zinc-200/60 rounded-lg animate-pulse" />
        <div className="h-4 w-72 dark:bg-zinc-800/40 bg-zinc-200/40rounded animate-pulse" />
      </div>
      <div className="rounded-2xl border dark:border-white/5 border-zinc-200 dark:bg-zinc-950/40 bg-zinc-50 overflow-hidden flex min-h-120">
        <div className="w-80 border-r dark:border-white/5 border-zinc-200 p-2 space-y-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-14 rounded-lg dark:bg-white/5 bg-zinc-200/50 animate-pulse"
            />
          ))}
        </div>
        <div className="flex-1 p-4 space-y-3">
          <div className="flex justify-start">
            <div className="h-16 w-3/4 rounded-xl dark:bg-white/5 bg-zinc-200/50 animate-pulse" />
          </div>
          <div className="flex justify-end">
            <div className="h-12 w-1/2 rounded-xl dark:bg-white/5 bg-zinc-200/50 animate-pulse" />
          </div>
          <div className="flex justify-start">
            <div className="h-20 w-4/5 rounded-xl dark:bg-white/5 bg-zinc-200/50 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function WidgetSkeleton() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto md:ml-64">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-16 dark:bg-zinc-800/60 bg-zinc-200/60 rounded animate-pulse" />
          <div className="h-8 w-64 dark:bg-zinc-800/60 bg-zinc-200/60 rounded-lg animate-pulse" />
          <div className="h-4 w-80 dark:bg-zinc-800/40 bg-zinc-200/40rounded animate-pulse" />
        </div>
        <div className="w-full md:w-80 h-20 rounded-2xl border border-white/10 dark:bg-zinc-900 bg-zinc-100/40 animate-pulse" />
      </div>
      <div className="h-135 rounded-xl border dark:border-white/5 border-zinc-200 dark:bg-zinc-950/60 bg-white animate-pulse" />
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto md:ml-64">
      <div className="flex flex-col gap-2">
        <div className="h-3 w-20 dark:bg-zinc-800/60 bg-zinc-200/60 rounded animate-pulse" />
        <div className="h-8 w-72 dark:bg-zinc-800/60 bg-zinc-200/60 rounded-lg animate-pulse" />
        <div className="h-4 w-96 dark:bg-zinc-800/40 bg-zinc-200/40rounded animate-pulse" />
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl border dark:border-white/5 border-zinc-200 dark:bg-zinc-950/70 bg-white p-5 h-28 animate-pulse" />
        <div className="rounded-2xl border dark:border-white/5 border-zinc-200 dark:bg-zinc-950/70 bg-white p-5 h-36 animate-pulse" />
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <aside className="w-65 dark:bg-black bg-white  flex-col h-screen fixed left-0 top-0 z-40 hidden md:flex">
      <div className="p-3">
        <div className="h-12 w-full rounded-lg dark:bg-zinc-900 bg-zinc-100 animate-pulse" />
      </div>
      <div className="flex-1 px-3 py-2 space-y-1">
        <div className="px-3 py-4">
          <div className="h-3 w-20 dark:bg-zinc-800/60 bg-zinc-200/60 rounded animate-pulse" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-10 rounded-md dark:bg-zinc-900 bg-zinc-100/50 animate-pulse"
          />
        ))}
      </div>
      <div className="p-3 border-t dark:border-white/5 border-zinc-200">
        <div className="h-14 rounded-lg dark:bg-zinc-900 bg-zinc-100 animate-pulse" />
      </div>
    </aside>
  );
}

export function ConversationListSkeleton() {
  return (
    <div className="space-y-1 p-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-14 rounded-lg dark:bg-white/5 bg-zinc-200/50 animate-pulse"
        />
      ))}
    </div>
  );
}

export function MessageListSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex justify-start">
        <div className="h-16 w-3/4 max-w-md rounded-xl dark:bg-white/5 bg-zinc-200/50 animate-pulse" />
      </div>
      <div className="flex justify-end">
        <div className="h-12 w-1/2 max-w-sm rounded-xl dark:bg-white/5 bg-zinc-200/50 animate-pulse" />
      </div>
      <div className="flex justify-start">
        <div className="h-20 w-4/5 max-w-md rounded-xl dark:bg-white/5 bg-zinc-200/50 animate-pulse" />
      </div>
    </div>
  );
}
