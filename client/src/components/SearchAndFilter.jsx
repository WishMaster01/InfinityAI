import React from "react";
import { Filter, Search } from "lucide-react";

const SearchAndFilter = ({ filters, activeFilter, search, onFilter, onSearch }) => {
  return (
    <div className="glass-card p-5 sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            className="field-input mt-0 pl-14"
            placeholder="Search AI tools by name..."
          />
        </label>

        <div className="flex items-center gap-2 text-base font-bold text-slate-500">
          <Filter className="h-5 w-5" />
          Filter tools
        </div>
      </div>

      <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilter(filter)}
            className={`chip shrink-0 ${
              activeFilter === filter ? "chip-active" : "chip-idle"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchAndFilter;
