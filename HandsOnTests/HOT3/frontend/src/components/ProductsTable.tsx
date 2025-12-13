import { useEffect, useState } from "react";
import { type Product, columns } from "./ui/columns";
import { DataTable } from "./ui/datatable";
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X, RefreshCw } from "lucide-react"

export default function ProductTable() {
    const [data, setData] = useState<Product[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [viewProductOpen, setViewProductOpen] = useState(false)
    const [editProductOpen, setEditProductOpen] = useState(false)

    const [keywords, setKeywords] = useState("");
    const [category, setCategory] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [sortBy, setSortBy] = useState("");

    
    const fetchProducts = async() => {
        try{
            setLoading(true)
            const params = new URLSearchParams()
             if (keywords) params.append("keywords", keywords);
             if (maxPrice) params.append("maxPrice", maxPrice);
             if (minPrice) params.append("minPrice", minPrice);
             if (category) params.append("category", category);
             if (sortBy) params.append("sortBy", sortBy);

            const response = await fetch(`http://localhost:2023/api/products?${params.toString()}`, {
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error(`Failed to load products: ${response.statusText}`)
            }
            
            const result = await response.json()
            setData(result.products || result || [])
        } catch (err) {
            console.error('Error loading products:', err)
            setError(err instanceof Error ? err.message : 'Failed to load products')
        } finally {
            setLoading(false)
        }
    }
    const resetFilters = () => {
        setKeywords("")
        setCategory("")
        setMinPrice("")
        setMaxPrice("")
        setSortBy("")
    }
useEffect(() => {
        fetchProducts()
    }, [keywords, minPrice, maxPrice, sortBy, category])

return(
        <>
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <input
                type="text"
                placeholder="Search by name"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="border rounded px-3 py-2"
                />

                <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="border rounded px-3 py-2"
                />

                <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border rounded px-3 py-2"
                />

                <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="createdAt">Newest</SelectItem>
                </SelectContent>
                </Select>

                <Button onClick={fetchProducts}>
                <Search className="w-4 h-4 mr-2" />
                Search
                </Button>

                <Button variant="outline" onClick={resetFilters}>
                <X className="w-4 h-4 mr-2" />
                Reset
                </Button>

                <Button variant="secondary" onClick={fetchProducts}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
                </Button>
            </div>

            {/* Table */}
            {loading ? (
                <p>Loading products...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <DataTable columns={columns} data={data} />
                )}
        </div>
            </>
        )
    }
