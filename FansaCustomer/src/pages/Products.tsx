import Header from "@/components/Header";
import IsError from "@/components/Loading/IsError";
import IsLoading from "@/components/Loading/IsLoading";
import PaginationList from "@/components/PaginationList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories } from "@/services/categoryService";
import { getProducts } from "@/services/productService";
import { category } from "@/types/category";
import { product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Products: React.FC = () => {
  const [alias, setAlias] = useState<string>();
  const [inputKeyword, setInputKeyword] = useState<string>("");
  const [keyword, setKeyword] = useState<string>();
  const [sortField, setSortField] = useState<string>();
  const [pageNum, setPageNum] = useState<number>(1);

  const {
    data: fetchProducts,
    isLoading: productIsLoading,
    isError: productIsError,
  } = useQuery({
    queryKey: ["products", alias, pageNum, sortField, keyword],
    queryFn: () =>
      getProducts({ alias, pageNum, sort_field: sortField, keyword }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });
  const {
    data: categories,
    isLoading: cateIsLoading,
    isError: cateIsError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });

  const handleSetAlias = (alias: string) => {
    setAlias(alias);
  };

  const handleSetSort = (sort: string) => {
    setSortField(sort);
  };

  const handleSetKeyword = () => {
    setKeyword(inputKeyword);
  };

  const handleClearKeyword = () => {
    setKeyword(undefined);
    setInputKeyword("");
  };
  const products = fetchProducts?.data;
  if (productIsLoading || cateIsLoading) return <IsLoading />;
  if (productIsError || cateIsError) return <IsError />;
  return (
    <>
      <Header />
      <div className="container mt-2">
        <div className="flex items-center justify-start gap-4">
          <div
            className={`cursor-pointer border-b-2 p-1 hover:border-green-500 ${alias === "alias" && "border-green-500"}`}
            onClick={() => handleSetAlias("alias")}
          >
            <h1 className="font-medium">All</h1>
          </div>
          {categories?.data.map((c: category) => (
            <div
              key={c.id}
              className={`cursor-pointer border-b-2 p-1 hover:border-green-500 ${alias === c.alias && "border-green-500"}`}
              onClick={() => handleSetAlias(c.alias)}
            >
              <h1 className="font-medium">{c.name}</h1>
            </div>
          ))}
        </div>
        <div className="flex w-full items-center justify-end gap-4">
          <Select onValueChange={(value) => handleSetSort(value)}>
            <SelectTrigger className="] w-[180px] rounded text-black">
              <SelectValue placeholder="Chọn options" />
            </SelectTrigger>
            <SelectContent className="rounded text-black">
              <SelectItem value="max_price">Giá từ cao xuống thấp</SelectItem>
              <SelectItem value="min_price">Giá từ thấp lên cao</SelectItem>
              <SelectItem value="new">Mới nhất</SelectItem>
            </SelectContent>
          </Select>
          <div className="my-4 flex w-72 items-center gap-2">
            <Input
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
              className="rounded-2xl"
              type="text"
              placeholder="tìm kiếm"
            />
            <Button
              onClick={handleSetKeyword}
              className="rounded"
              type="button"
            >
              <FaSearch />
            </Button>
            <Button onClick={handleClearKeyword}>Clear</Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-8 lg:justify-start">
          {products &&
            products.entity.map((p: product) => (
              <Card className="h-72 w-1/3 border-green-500 lg:w-1/6" key={p.id}>
                <CardHeader>
                  <CardDescription className="h-28 ">
                    <img src={p.main_image} width={200} height={100} />
                  </CardDescription>
                  <hr className="w-full border-gray-600" />
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <Link to={`/products/${p.alias}`}>
                    <h1 className="font-semibold">{p.name}</h1>
                  </Link>
                </CardContent>
                <CardFooter className="block">
                  <h1 className="text-xl text-red-700">
                    {p.price - p.price * (p.sale / 100)} đ
                  </h1>
                  <div>
                    <h1 className="text-lg line-through opacity-35">
                      {p.price} đ
                    </h1>
                  </div>
                </CardFooter>
              </Card>
            ))}
          <PaginationList
            setState={setPageNum}
            pageNumber={pageNum}
            totalPages={products?.total_pages}
          />
        </div>
      </div>
      <div>footer</div>
    </>
  );
};

export default Products;
