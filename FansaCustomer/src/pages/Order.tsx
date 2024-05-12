import Header from "@/components/Header";
import IsError from "@/components/Loading/IsError";
import IsLoading from "@/components/Loading/IsLoading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrder } from "@/services/orderService";
import { order } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Order: React.FC = () => {
  const info = localStorage.getItem("info");
  const userInfo = info ? JSON.parse(info) : null;
  const { data, isLoading, isError } = useQuery({
    queryKey: ["order"],
    queryFn: () => getOrder(userInfo.id),
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });
  const order = data?.data;
  if (isLoading) return <IsLoading />;
  if (isError) return <IsError />;
  return (
    <>
      <Header />
      <div className="container mt-4 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold text-green-400">
          Lịch sủ đặt hàng của bạn!
        </h1>
        <div className="w-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Ngày đặt hàng</TableHead>
                <TableHead className="text-right">Tổng tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.map((o: order) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.name}</TableCell>
                  <TableCell>{o.address}</TableCell>
                  <TableCell>{o.phone}</TableCell>
                  <TableCell>{o.order_time}</TableCell>
                  <TableCell className="text-right">{o.total}đ</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default Order;
