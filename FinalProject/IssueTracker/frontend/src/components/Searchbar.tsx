import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

import { SearchFilters } from "./types/interfaces";
import api from "@/lib/api";
import { useState,useEffect } from "react";



export default function SearchBar() {
    const [filters, setFilters] = useState<SearchFilters>({}); 
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    return(

    )

}