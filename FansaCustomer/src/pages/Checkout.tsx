import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cart, checkoutInfo } from "@/types/cart";
import Header from "@/components/Header";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { placeOrder } from "@/services/orderService";
import { BsEmojiDizzyFill } from "react-icons/bs";
import { PayPalButtons } from "@paypal/react-paypal-js";

const formSchema = z.object({
  payment: z.string(),
  address: z.string().min(1, {
    message: "địa chỉ không được để trống!",
  }),
  name: z.string().min(1, {
    message: "tên không được để trống!",
  }),
  phone: z.string().min(10, {
    message: "số điện thoại phải từ 10 số trở lên!",
  }),
  total: z.number(),
});

const Checkout: React.FC = () => {
  const [total, setTotal] = useState<number>(0);
  const navigate = useNavigate();
  const info = localStorage.getItem("info");
  const userInfo = info ? JSON.parse(info) : null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payment: "",
      address: "",
      name: "",
      phone: "",
      total: 0,
    },
  });

  const queryClient = useQueryClient();
  const dataCart = queryClient.getQueryData(["cart"]);
  const cart = dataCart?.data;

  // MUTATE
  const mutateOrder = useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      toast.remove("1");
      toast.success("Bạn đã thanh toán thành công!");
      navigate("/");
    },
    onError: () => {
      toast.remove("1");
      toast.error("Thanh toán thất bại!", {
        icon: <BsEmojiDizzyFill className="text-red-500" />,
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast.loading("Waiting...", {
      id: "1",
    });
    const data: checkoutInfo = values;
    mutateOrder.mutate({ info: data, customerId: userInfo.id });
  };

  const handleSubmitForm = () => {
    form.handleSubmit(onSubmit)();
  };

  useEffect(() => {
    if (cart) {
      let sum = 0;
      cart?.map((c: cart) => {
        sum = sum + c.product.price * c.quantity;
      });
      setTotal(sum);
      form.setValue("total", sum);
    }
  }, [cart]);

  // PAYPAL
  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      const dataPaypal = {
        payment: form.getValues("payment"),
        address: form.getValues("address"),
        phone: form.getValues("phone"),
        name: details.payer.name.given_name,
        total: total,
      };
      dataPaypal.total = total;

      mutateOrder.mutate({ info: dataPaypal, customerId: userInfo.id });
      console.log("vcc");
    });
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: total,
          },
        },
      ],
    });
  };

  if (!dataCart) return <Navigate to="/cart" />;
  return (
    <>
      <Header />
      <div className="container mt-4">
        <div className="m-4 flex justify-center">
          <div className="flex h-auto w-auto gap-4 p-4">
            <div className="flex w-[350px] flex-col gap-2">
              <h1 className="text-xl font-bold">Product Checkout</h1>
              <h1 className="font-semibold">Contact Info</h1>
              <div>
                <Form {...form}>
                  <form className="space-y-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              className="rounded"
                              placeholder="name"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Vui lòng nhập tên bạn tại đây!
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input
                              className="rounded"
                              placeholder="address"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Vui lòng nhập địa chỉ bạn tại đây!
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              className="rounded"
                              placeholder="phone"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Vui lòng nhập số điện thoại bạn tại đây!
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="payment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment</FormLabel>
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="rounded">
                                <SelectValue placeholder="Select a fruit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded">
                              <SelectItem value="CREDIT_CARD">
                                CREDIT_CARD
                              </SelectItem>
                              <SelectItem value="COD">COD</SelectItem>
                            </SelectContent>
                          </Select>

                          <FormDescription>
                            chọn options để thanh toán!
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-6">
              <h1 className="font-semibold">Order Details ( {cart.length} )</h1>
              {cart.map((c: cart) => (
                <div key={c.id} className="flex items-center gap-4">
                  <img
                    src={c.product.main_image}
                    width={100}
                    height={100}
                    className="rounded-xl"
                  />
                  <div>
                    <h1 className="w-48 font-medium">{c.product.name}</h1>
                    <h1 className="text-sm">Số lượng {c.quantity}</h1>
                    <h1 className="text-sm">{c.product.price} đ x</h1>
                  </div>
                </div>
              ))}
              {form.getValues("payment") == "CREDIT_CARD" && (
                <h1 className="font-bold text-red-500">
                  Nhập thông tin đầy đủ trước khi thanh toán Paypal
                </h1>
              )}
              {form.getValues("payment") == "CREDIT_CARD" && (
                <PayPalButtons
                  createOrder={(data, actions) => createOrder(data, actions)}
                  onApprove={(data, actions) => onApprove(data, actions)}
                />
              )}
              <hr className="w-full" />
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Total:</h1>
                <h1 className="text-xl">{total} đ</h1>
              </div>

              <Dialog>
                <DialogTrigger className="rounded-[10px]" asChild>
                  <Button className="mt-2  bg-green-500 hover:bg-green-300 hover:opacity-30">
                    Thanh toán
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-xl bg-white sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Xác nhận thanh toán</DialogTitle>
                  </DialogHeader>
                  <div>
                    <h1>Vui lòng nhấn xác nhận để thanh toán</h1>
                  </div>
                  <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                      <Button
                        onClick={handleSubmitForm}
                        type="submit"
                        variant="secondary"
                        className="rounded bg-green-300 hover:bg-green-500"
                      >
                        Xác nhận
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        className="rounded bg-red-300 hover:bg-red-500 "
                        type="button"
                      >
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
