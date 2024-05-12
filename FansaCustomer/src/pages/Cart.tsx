import Header from "@/components/Header";
import IsError from "@/components/Loading/IsError";
import IsLoading from "@/components/Loading/IsLoading";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cart } from "@/types/cart";
import { deleteCart, getCart } from "@/services/cartService";

const Cart: React.FC = () => {
  const [total, setTotal] = useState<number>(0);
  const info = localStorage.getItem("info");
  const userInfo = info ? JSON.parse(info) : null;
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(userInfo.id),
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });
  const cart = data?.data;

  //MUTATE DELETE
  const mutateDelete = useMutation({
    mutationFn: deleteCart,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["cart"] });
      toast.remove("1");
      toast.success("xoá khỏi giỏ hàng thành công!");
    },
    onError: () => {
      toast.remove("1");
      toast.error("lỗi không xác định!");
    },
  });

  const handleDeleteProduct = (productId: number) => {
    toast.loading("Waiting...", {
      id: "1",
    });
    mutateDelete.mutate({ productId, customerId: userInfo.id });
  };

  useEffect(() => {
    if (cart) {
      let sum = 0;
      cart?.map((c: cart) => {
        sum = sum + c.product.price * c.quantity;
      });
      setTotal(sum);
    }
  }, [cart]);
  if (isLoading) return <IsLoading />;
  if (isError) return <IsError />;
  return (
    <>
      <Header />
      <div className="container flex justify-center">
        <div className="mt-4 flex h-auto w-auto justify-center rounded bg-green-100">
          <div className="m-4 flex flex-col gap-4">
            <Link to="/">
              <div className="flex items-center gap-2">
                <FaLongArrowAltLeft />
                <h1 className="font-semibold">Quay Trở lại</h1>
              </div>
            </Link>
            <hr className="w-full border-2 border-gray-400" />
            <h1>Giỏ hàng</h1>
            <h2>
              {userInfo.name} đang có {cart.length} sản phẩm trong giỏ hàng
            </h2>

            {cart.map((c: cart) => (
              <div
                key={c.id}
                className="flex items-center gap-4 rounded p-2 shadow-lg"
              >
                <img
                  src={c.product.main_image}
                  width={50}
                  height={50}
                  className="rounded-xl"
                />
                <div className="w-[425px]">
                  <h1 className="font-bold">{c.product.name}</h1>
                </div>
                <h1>{c.quantity}</h1>
                <h1>{c.quantity * c.product.price} đ</h1>
                <div
                  className="cursor-pointer rounded p-2 hover:bg-red-400"
                  onClick={() => handleDeleteProduct(c.product.id)}
                >
                  <CiTrash />
                </div>
              </div>
            ))}
          </div>

          <div className="m-4 flex flex-col gap-4 rounded bg-slate-500 p-4 text-white">
            <div className="flex items-center gap-4">
              <h1>Card Details</h1>
              <img
                src={userInfo.photo}
                width={50}
                height={50}
                className="rounded-xl"
              />
            </div>
            <Button className="rounded bg-pink-600 text-white hover:bg-pink-400 hover:shadow-2xl">
              Momo
            </Button>
            <hr className="w-full" />
            <div className="mt-auto flex items-center justify-between">
              <h1>Tổng tiền</h1>
              <h1>{total} đ</h1>
            </div>
            {total > 0 ? (
              <Link to="/checkout">
                <Button className="flex justify-between gap-4 rounded bg-blue-500 hover:bg-blue-300">
                  <h1>{total} đ</h1>
                  <div className="flex items-center gap-2">
                    <h1>Checkout</h1>
                    <FaLongArrowAltRight />
                  </div>
                </Button>
              </Link>
            ) : (
              <Button
                disabled
                className="flex justify-between gap-4 rounded bg-blue-500 hover:bg-blue-300"
              >
                <h1>{total} đ</h1>
                <div className="flex items-center gap-2">
                  <h1>Checkout</h1>
                  <FaLongArrowAltRight />
                </div>
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
