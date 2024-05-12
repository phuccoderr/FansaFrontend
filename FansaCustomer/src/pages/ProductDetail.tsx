import Header from "@/components/Header";
import IsError from "@/components/Loading/IsError";
import IsLoading from "@/components/Loading/IsLoading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { addToCart } from "@/services/cartService";
import { getProduct } from "@/services/productService";
import { details, images } from "@/types/product";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";

const ProductDetail: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [content, setContent] = useState<string>("fullDescription");
  const { productAlias } = useParams();

  const info = localStorage.getItem("info");
  const userInfo = info ? JSON.parse(info) : null;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", productAlias],
    queryFn: () => getProduct(productAlias),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });
  const product = data?.data;

  // MUTATE ADD PRODUCT TO CART
  const mutateCart = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      toast.remove("1");
      toast.success("Thêm sản phẩm thành công!");
    },
    onError: (error) => {
      toast.remove("1");
      toast.error(error.message);
    },
  });

  const handleAddProduct = () => {
    toast.loading("Waiting...", {
      id: "1",
    });
    mutateCart.mutate({
      productId: product.id,
      customerId: userInfo.id,
      quantity,
    });
  };

  const handleContent = (content: string): void => {
    setContent(content);
  };
  if (isLoading) return <IsLoading />;
  if (isError) return <IsError />;
  return (
    <>
      <Header />
      <div className=" w-full border-y-2 border-t-gray-300 p-2">
        <div className="container px-6 py-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/products`}>products</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold">
                  {productAlias}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="container mt-2 flex">
        <div className="flex h-96 w-1/3 items-center justify-center ">
          {/* <img src={product?.mainImage} className="h-[350px] w-[300px]" /> */}
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              <CarouselItem>
                <img
                  src={product?.main_image}
                  className="h-[350px] w-[300px]"
                />
              </CarouselItem>
              {product.product_images.map((i: images) => (
                <CarouselItem key={i.id}>
                  <img src={i?.name} className="h-[350px] w-[300px]" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="w-2/3 ">
          <div className="m-8 flex flex-col">
            <div>
              <h1 className="text-3xl font-bold">{product?.name}</h1>
            </div>
            <div className="my-4 text-2xl">
              {product.price - product.price * (product.sale / 100)} đ
            </div>
            <div className="my-4">
              <h1>{product.short_description}</h1>
            </div>
            <div className=" my-4 flex items-center gap-4">
              <div className="flex items-center justify-center rounded border border-gray-400">
                <Button
                  onClick={() => {
                    if (quantity - 1 > 0) {
                      setQuantity(quantity - 1);
                    }
                  }}
                  className="border-0 shadow-none hover:bg-green-200"
                >
                  -
                </Button>
                <h1 className="mx-2">{quantity}</h1>
                <Button
                  onClick={() => setQuantity(quantity + 1)}
                  className="border-0 shadow-none hover:bg-green-200"
                >
                  +
                </Button>
              </div>
              <Button
                onClick={handleAddProduct}
                className="w-56 rounded bg-black text-white hover:bg-green-500"
              >
                Add To Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-2 h-60  border-t-2">
        <div className="mx-20 flex">
          <div className="border-r-2">
            <ul className="flex w-72 flex-col gap-4 p-4 font-semibold">
              <li
                className={`mr-[10rem] cursor-pointer hover:border-b-2 hover:border-b-gray-600 ${content === "fullDescription" && "border-b-2 border-b-gray-600"}`}
                onClick={() => handleContent("fullDescription")}
              >
                Description
              </li>
              <li
                className={`mr-[9rem] cursor-pointer hover:border-b-2 hover:border-b-gray-600 ${content === "details" && "border-b-2 border-b-gray-600"}`}
                onClick={() => handleContent("details")}
              >
                Product Details
              </li>
            </ul>
          </div>

          {content === "fullDescription" && (
            <div className="ml-4 p-4">{product.full_description}</div>
          )}
          {content === "details" && (
            <div className="ml-4 w-72 p-4">
              {product.product_details.map((d: details) => (
                <div key={d.id} className="flex items-center justify-between">
                  <h1 className="text-lg font-bold">{d.name}:</h1>
                  <h1 className="text-lg">{d.value}</h1>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
