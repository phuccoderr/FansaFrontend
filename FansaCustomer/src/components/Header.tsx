import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BsEmojiTearFill } from "react-icons/bs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MdOutlineShoppingCart } from "react-icons/md";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const info = localStorage.getItem("info");
  const userInfo = info ? JSON.parse(info) : null;

  const handleLogout = (): void => {
    localStorage.removeItem("info");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
    toast.success("Bạn đã đăng xuất!", {
      icon: <BsEmojiTearFill className="text-orange-400" />,
    });
  };
  return (
    <div className="top-0 w-full bg-slate-100">
      <div className="container flex items-center gap-4 p-4 ">
        <div className="flex-none p-2">
          <Link to="/">
            <h1 className="text-3xl font-bold text-green-400">FANSA</h1>
          </Link>
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-4">
            <div>
              <Link to="/">
                <h1 className="text-lg font-semibold">Home</h1>
              </Link>
            </div>
            <div>
              <Link to="/products">
                <h1 className="text-lg font-semibold">Product</h1>
              </Link>
            </div>
          </div>
        </div>
        <div className="cursor-pointer rounded-2xl p-3 hover:bg-green-200">
          <Link to="/cart">
            <MdOutlineShoppingCart className="text-xl" />
          </Link>
        </div>

        {info ? (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Avatar>
                    <AvatarImage src={userInfo.photo} alt="@shadcn" />
                    <AvatarFallback className="bg-gray-400">
                      {userInfo.name}
                    </AvatarFallback>
                  </Avatar>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="right-0  ">
                  <ul className=" w-[100px] bg-white ">
                    <li className="p-3 text-sm font-medium text-gray-500 hover:text-black">
                      <Link to="/account">
                        <h1>Account</h1>
                      </Link>
                    </li>

                    <hr className="mx-4" />
                    <li className="p-3 text-sm font-medium text-gray-500 hover:text-black">
                      <Link to="/order">
                        <h1>Order</h1>
                      </Link>
                    </li>

                    <hr className="mx-4" />
                    <li
                      onClick={handleLogout}
                      className="cursor-pointer p-3 text-sm font-medium text-gray-500 hover:text-black"
                    >
                      Đăng xuất
                    </li>
                    <hr />
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        ) : (
          <Link to="/login">
            <h1>Account</h1>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
