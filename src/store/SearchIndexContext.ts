import { createContext } from "react";
import type { SearchIndex } from "@/search/types";

export const SearchIndexContext = createContext<SearchIndex | null>(null);
