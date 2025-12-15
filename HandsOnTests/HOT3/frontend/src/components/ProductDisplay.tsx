"use client"

import api from "@/lib/api";
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductEditor } from "./editProduct";
//import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AddProduct } from "./AddProduct";


interface Product {
    _id: string
    name: string;
    category: string;
    description: string;
    price: number;
    createdAt: string;
}

function ProductDisplay(){
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
     const [addOpen, setAddOpen] = useState(false);
     //const navigate = useNavigate();

    const [keywords, setKeywords] = useState('');
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('name');

    const reset = () => {
      setKeywords('');
      setCategory('');
      setMinPrice('');
      setMaxPrice('');
      setSortBy('name');
      fetchProducts();
    };

    const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keywords) params.append('keywords', keywords);
      if (category) params.append('category', category);
      if (minPrice) params.append('minPrice', Number(minPrice).toString());
      if (maxPrice) params.append('maxPrice', Number(maxPrice).toString());
      if (sortBy) params.append('sortBy', sortBy);

      const response = await api.get<Product[]>(`http://localhost:2023/api/products?${params.toString()}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  

    const handleDelete = async (productId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
     
      await api.delete(`/products/${productId}`);
      toast.success("Product deleted successfully");
      fetchProducts()
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

    if (loading) {
            return <p className="text-center mt-10">Loading products...</p>;
    }
    return ( 
      <>
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <div className="flex flex-wrap gap-2 mb-6">
        <Input
          placeholder="Keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="flex-1 min-w-[150px]"
        />
        <Input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 min-w-[120px]"
        />
        <Input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-24"
        />
        <Input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-24"
        />
        <Select onValueChange={setSortBy} value={sortBy}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="lowestPrice">Lowest Price</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={fetchProducts}>Search</Button>
        <Button variant="secondary" onClick={reset}>Reset</Button>
        <Button onClick={() => setAddOpen(true)}>Add Product</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product._id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.category}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground mb-3">
                {product.description}
              </p>
              <p className="text-lg font-semibold">${product.price}</p>
            </CardContent>
            <CardFooter>
                <ProductEditor
                productId={product._id}
                showError={console.error}
                showSuccess={console.log}
                refresh={fetchProducts}
                />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(product._id)}
              >Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
    <AddProduct
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={fetchProducts}
      />
</>
    );
}

export default ProductDisplay;