import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
// import { registerCustomer } from "@/services/signin";
import toast from "react-hot-toast";
import { BsEmojiDizzyFill } from "react-icons/bs";
import { registerRequest } from "@/types/AccountRequest";
import { register } from "@/services/Account";
// import { registerRequest } from "@/types/accountRequest";

const formSchema = z
  .object({
    email: z.string().email({
      message: "Email nhập không đúng định dạng",
    }),
    name: z.string(),
    password: z.string().min(6, {
      message: "Mật khẩu ít nhất phải 6 kí tự trở lên!",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "mật khẩu không trùng khớp",
    path: ["confirmPassword"],
  });

const RegisterAccount: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  // MUTATE REGISTER
  const mutateRegister = useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.remove("1");
      toast.success("Bạn đã đăng ký thành công!");
    },
    onError: () => {
      toast.remove("1");
      toast.error("Đăng ký thất bại, email đã có người đặt!", {
        icon: <BsEmojiDizzyFill className="text-red-500" />,
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast.loading("Waiting...", {
      id: "1",
    });
    const data: registerRequest = values;
    mutateRegister.mutate(data);
  };
  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <CardTitle className="mb-4 text-center font-bold">
              REGISTER ACCOUNT
            </CardTitle>
            <CardDescription className="">
              Nhập thông tin đầy đủ để đăng ký tài khoản!
            </CardDescription>
          </CardHeader>
          <CardContent style={{ margin: 0 }}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input className="rounded" placeholder="email" {...field} />
                  </FormControl>
                  <FormDescription>
                    Vui lòng nhập email bạn tại đây!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input className="rounded" placeholder="name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Vui lòng nhập tên của bạn tại đây!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passowrd</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded"
                      type="password"
                      placeholder="password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Vui lòng nhập mật khẩu bạn tại đây!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded"
                      type="password"
                      placeholder="confirm password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Xác nhận lại mật khẩu!</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="hover:opacity-30">
              Đăng ký
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default RegisterAccount;
