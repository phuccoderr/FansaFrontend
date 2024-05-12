import {
  Avatar,
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { MenuItem, Menu, Sidebar, sidebarClasses } from "react-pro-sidebar";
import { tokens } from "../../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import avatar from "../../assets/img/faces/anya.jpg";
import { Link, useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBook";
// Item in ProSidebar
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      onClick={() => setSelected(title)}
      icon={icon}
      component={<Link to={to} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

function ProSidebar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();
  //GET USER
  const user = JSON.parse(localStorage.getItem("user"));
  //LOG OUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    window.location.href = "/";
  };

  return (
    <Box height="100%">
      <Sidebar
        style={{ height: "100%" }}
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: `${colors.primary[400]} !important`,
          },
          borderRight: "none",
        }}
        collapsed={isCollapsed}
      >
        <Menu
          menuItemStyles={{
            button: (props) => {
              if (props.level === 0) {
                return {
                  "&:hover": {
                    color: "#868dfb !important",
                    backgroundColor: `${colors.primary[400]}`,
                  },
                  color: props.active ? "#868dfb !important" : "blue",
                };
              }
            },
          }}
        >
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={
              isCollapsed ? (
                <MenuOutlinedIcon color={colors.grey[100]} />
              ) : undefined
            }
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  FAHASHA
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon color={colors.grey[100]} />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {/* USER */}
          {user
            ? !isCollapsed && (
                <Box mb="25px">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Avatar
                      src={avatar}
                      sx={{
                        width: "100px",
                        height: "100px",
                        cursor: "pointer",
                      }}
                    />
                  </Box>
                  <Box textAlign="center">
                    <Typography
                      variant="h2"
                      color={colors.grey[100]}
                      fontWeight="bold"
                      sx={{ m: "10px 0 0 0" }}
                    >
                      {user.name} [{user.roles.map((role) => role.name)}]
                    </Typography>
                    <Button variant="primary" onClick={handleLogout}>
                      Log Out
                    </Button>
                  </Box>
                </Box>
              )
            : !isCollapsed && (
                <Box mb="25px">
                  <Box textAlign="center">
                    <Link to="/login">
                      <Typography
                        variant="h2"
                        color={colors.grey[100]}
                        fontWeight="bold"
                      >
                        Đăng nhập
                      </Typography>
                    </Link>
                  </Box>
                </Box>
              )}
          {/* MENU ITEMS */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {/* Dashboard */}
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* Data */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Manage Team"
              to="/users"
              icon={<GroupsIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Create User"
              to="/user"
              icon={<PersonOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Categories"
              to="/categories"
              icon={<CategoryOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Products"
              to="/products"
              icon={<MenuBookIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
}

export default ProSidebar;
