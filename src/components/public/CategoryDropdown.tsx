"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  name: string;
  slug: string;
}

interface CategoryDropdownProps {
  categories: Category[];
}

export default function CategoryDropdown({ categories }: CategoryDropdownProps) {
  const router = useRouter();

  const handleValueChange = (value: string) => {
    if (value) {
      router.push(`/category/${value}`);
    }
  };

  return (
    <div className="w-full">
      <Select onValueChange={handleValueChange}>
        <SelectTrigger className="w-full bg-white border-gray-200 text-gray-700 font-medium">
          <SelectValue placeholder="Select a category..." />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.slug} value={cat.slug}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
