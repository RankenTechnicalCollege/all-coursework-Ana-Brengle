import { useState,useEffect } from "react";
import { useNavigate} from "react-router-dom";
import {z} from "zod";
import {productSchema} from "@/schemas/productSchema";
import api from "@/lib/api";
import {AxiosError} from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  productId: string;
  name: string
  description: string
  price: number
  category: string
}
interface ProductEditorProps {
  productId: string;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

export function ProductEditor({productId, showError, showSuccess}: ProductEditorProps) {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: ""
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${productId}`);
        setProduct(response.data);
        setFormData({
          category: response.data.category || "",
          name: response.data?.name || "",
          price: response.data.price || "",
          description: response.data.description || ""
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch Product");
        setLoading(false);
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setValidationErrors({});

    try {
      const validatedData = productSchema.parse({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
      });
      await api.patch(`/products/${productId}`, validatedData);
      showSuccess("product updated successfully");
      navigate("/ProductDisplay");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setValidationErrors(fieldErrors);
        setSaving(false);
        return;
      }

      const axiosError = err as AxiosError<{
        type: string;
        fields: Record<string, string>;
        message: string;
      }>;

          if (
        axiosError.response?.status === 400 &&
        axiosError.response?.data?.type === "ValidationFailed"
      ) {
        setValidationErrors(axiosError.response.data.fields || {});
        //showError(axiosError.response.data.message || "Validation failed");
        setSaving(false);
        return;
      }


      showError("Failed to update product");
      setSaving(false);
      console.error("Error updating product:", err);
    }
  };
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-lg">Loading product...</p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-lg">Product not found</p>
      </div>
    );
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit Product
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <FieldGroup>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              {validationErrors.name && (
                <p className="text-sm text-red-500">{validationErrors.name}</p>
              )}
            </FieldGroup>
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <FieldGroup>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
              {validationErrors.description && (
                <p className="text-sm text-red-500">{validationErrors.description}</p>
              )}
            </FieldGroup>
          </Field>

          <Field>
            <FieldLabel>Category</FieldLabel>
            <FieldGroup>
              <Select name="category"value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Books">Books</SelectItem>
                </SelectContent>
              </Select>
            </FieldGroup>
          </Field>

          <Field>
            <FieldLabel>Price</FieldLabel>
            <FieldGroup>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
              />
              {validationErrors.price && (
                <p className="text-sm text-red-500">{validationErrors.price}</p>
              )}
            </FieldGroup>
          </Field>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
