/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { Input } from "../ui/input";

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
import { useMutation } from "@tanstack/react-query";
import { useGoogleLogin } from "@react-oauth/google";
// import { loginCustomer, loginFacebook, loginGoogle } from "@/services/signin";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BsEmojiDizzyFill } from "react-icons/bs";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { signIn, signInFB, signInGG } from "@/services/Account";
import { signInRequest } from "@/types/AccountRequest";
// import { loginRequest } from "@/types/accountRequest";

const formSchema = z.object({
  email: z.string().email({
    message: "Email nhập không đúng định dạng",
  }),
  password: z.string().min(6, {
    message: "Mật khẩu ít nhất phải 6 kí tự trở lên!",
  }),
});

const SigninAccount: React.FC = () => {
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // MUTATE GOOGLE
  const mutateGoogle = useMutation({
    mutationFn: signInGG,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.data.access_token);
      localStorage.setItem("info", JSON.stringify(data.data.info));
      localStorage.setItem("refresh_token", data.data.refresh_token);
      navigate("/");
      toast.remove("1");
      toast.success("Đăng nhập thành công!");
    },
    onError: () => {
      toast.remove("1");
      toast.error("Email hoặc Password không đúng!");
    },
  });

  // MUTATE FACEBOOK
  const mutateFacebook = useMutation({
    mutationFn: signInFB,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.data.access_token);
      localStorage.setItem("info", JSON.stringify(data.data.info));
      localStorage.setItem("refresh_token", data.data.refresh_token);
      navigate("/");
      toast.remove("1");
      toast.success("Đăng nhập thành công!");
    },
    onError: () => {
      toast.remove("1");
      toast.error("Email hoặc Password không đúng!");
    },
  });

  // MUTATE LOGIN REQUEST
  const mutateLogin = useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.data.access_token);
      localStorage.setItem("refresh_token", data.data.refresh_token);
      localStorage.setItem("info", JSON.stringify(data.data.info));
      navigate("/");
      toast.remove("1");
      toast.success("Đăng nhập thành công!");
    },
    onError: () => {
      toast.remove("1");
      toast.error("Email hoặc Password không đúng!", {
        icon: <BsEmojiDizzyFill className="text-red-500" />,
      });
    },
  });

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const accessToken = codeResponse.access_token;
      toast.loading("Waiting...", {
        id: "1",
      });
      mutateGoogle.mutate(accessToken);
    },
  });

  const responseFacebook = async (response: any) => {
    const accessToken = response.accessToken;
    toast.loading("Waiting...", {
      id: "1",
    });
    mutateFacebook.mutate(accessToken);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data: signInRequest = values;
    toast.loading("Waiting...", {
      id: "1",
    });
    mutateLogin.mutate(data);
  };

  if (token) {
    return <Navigate to="/" />;
  }
  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <CardTitle className="mb-4 font-bold">LOGIN ACCOUNT</CardTitle>
            <CardDescription className="flex items-center justify-between gap-4">
              <Button type="button" onClick={() => login()} className="w-full">
                <FaGoogle className="mr-2" /> Google
              </Button>

              <FacebookLogin
                appId="706607587464000"
                fields="accessToken"
                callback={responseFacebook}
                render={(renderProps: any) => (
                  <Button
                    type="button"
                    onClick={renderProps.onClick}
                    className="w-full"
                  >
                    <FaFacebookF className="mr-2" /> Facebook
                  </Button>
                )}
              />
            </CardDescription>
            <div className="mt-2 flex items-center justify-center gap-2">
              <hr className="flex-grow"></hr>
              <h1>Đăng nhập với</h1>
              <hr className="flex-grow" />
            </div>
          </CardHeader>
          <CardContent style={{ margin: 0 }} className="space-y-2">
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passowrd</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded"
                      type="password"
                      placeholder="mật khẩu"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Vui lòng nhập password bạn tại đây!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="hover:opacity-30">
              Đăng nhập
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default SigninAccount;
