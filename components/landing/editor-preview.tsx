/** Decorative faux editor window used in the hero — pure presentation. */
export function EditorPreview() {
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl shadow-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-950">
      {/* window bar */}
      <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
        <span className="ml-3 rounded-md bg-white px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">
          main.py
        </span>
        {/* presence dots */}
        <div className="ml-auto flex -space-x-1.5">
          <span className="h-5 w-5 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-zinc-950" />
          <span className="h-5 w-5 rounded-full bg-pink-500 ring-2 ring-white dark:ring-zinc-950" />
          <span className="h-5 w-5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />
        </div>
      </div>

      {/* fake code with two remote cursors */}
      <div className="space-y-2 p-5 font-mono text-xs leading-relaxed">
        <div>
          <span className="text-purple-500">def</span>{" "}
          <span className="text-blue-500">greet</span>
          <span className="text-zinc-400">(name):</span>
        </div>
        <div className="relative pl-6">
          <span className="text-zinc-400">print(</span>
          <span className="text-emerald-500">f&quot;Hi, {"{name}"}!&quot;</span>
          <span className="text-zinc-400">)</span>
          <span className="absolute -top-4 left-40 rounded bg-pink-500 px-1 text-[9px] text-white">
            Sara
          </span>
          <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-pink-500 align-middle" />
        </div>
        <div className="pl-6 text-zinc-300 dark:text-zinc-600">
          # collaborators join instantly
        </div>
        <div>
          <span className="text-blue-500">greet</span>
          <span className="text-zinc-400">(</span>
          <span className="text-emerald-500">&quot;world&quot;</span>
          <span className="text-zinc-400">)</span>
          <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-indigo-500 align-middle" />
          <span className="ml-1 rounded bg-indigo-500 px-1 text-[9px] text-white">
            You
          </span>
        </div>
      </div>

      {/* fake output */}
      <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-2 font-mono text-xs text-emerald-600 dark:border-zinc-800 dark:bg-zinc-900">
        $ Hi, world!
      </div>
    </div>
  );
}
