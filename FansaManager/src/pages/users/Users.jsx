import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AdminPanelSettingsSharpIcon from "@mui/icons-material/AdminPanelSettingsSharp";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser, listUsers } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DialogMUI from "../../components/DialogMUI";

function Users() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState(0);
  //GET USER
  const userLogin = JSON.parse(localStorage.getItem("user"));
  // fetchUser
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () => listUsers(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });
  //DELETE USER
  const mutationDeleteUser = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.refetchQueries(["users"]);
      toast.success("Đã xoá user thành công!");
    },
    onError: (error) => {
      if (error.response) {
        let errorResponse = error.response.data.error;
        errorResponse.map((msg) => {
          toast.error(msg);
        });
      } else {
        toast.error(error.message);
      }
    },
  });
  const handleClickOpen = (id) => {
    setUserId(id);
    setOpen(true);
  };

  const handleDeleteUser = (id) => {
    mutationDeleteUser.mutate(id);
  };

  //CHECK USER
  useEffect(() => {
    if (!userLogin) {
      navigate("/login");
    }
  }, []);

  if (isLoading) {
    return (
      <Box>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        <div>Error</div>
      </Box>
    );
  }

  // Row material grid
  const users = data.data;
  const rows = users.map((data) => {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      accessLevel: data.roles.map((role) => role.name),
    };
  });

  // Column material gird
  const columns = [
    {
      field: "id",
      headerName: "ID",
      cellClassName: "name-column--cell",
      width: 150,
    },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    {
      field: "accessLevel",
      headerName: "Access Level",
      width: 150,
      renderCell: ({ row: { accessLevel } }) => {
        return (
          <Box
            mt="10px"
            p="3px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              accessLevel === "ADMIN"
                ? colors.greenAccent[600]
                : accessLevel === "STAFF"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {accessLevel == "ADMIN" && <AdminPanelSettingsSharpIcon />}
            {accessLevel == "STAFF" && <SecurityOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {accessLevel}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: ({ row }) => {
        return (
          <Box
            display="flex"
            p="3px"
            justifyContent="center"
            alignItems="center"
          >
            {row.id !== userLogin.id && (
              <Link to={`/users/${row.id}`}>
                <Button
                  sx={{ margin: "4px", padding: "4px" }}
                  variant="contained"
                  color="primary"
                  startIcon={<EditNoteIcon />}
                  disabled={userLogin.roles.some(
                    (role) => role.name !== "ADMIN"
                  )}
                >
                  Edit User
                </Button>
              </Link>
            )}
            {/* () => handleDeleteUser(`${row.id}`) */}
            {row.id !== userLogin.id && (
              <Button
                sx={{ margin: "4px", padding: "4px" }}
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                disabled={userLogin.roles.some((role) => role.name !== "ADMIN")}
                onClick={() => handleClickOpen(row.id)}
              >
                Delete
              </Button>
            )}
            <DialogMUI
              title="Remove"
              contentText="Bạn có chắc chắn xoá user này không ?"
              open={open}
              setOpen={setOpen}
              handleEvent={() => handleDeleteUser(userId)}
            ></DialogMUI>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m={2}>
      <Header title="TEAM" subtitle="Managing the Team Members" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-toolbarContainer": {
            backgroundColor: `${colors.blueAccent[200]}`,
          },
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-columnHeader": {
            borderBottom: "none",
            borderRight: `1px solid ${colors.blueAccent[100]}`,
            textAlign: "center",
            width: "100px",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: colors.blueAccent[800],
          },
        }}
      >
        <Box width="100%">
          <DataGrid
            slots={{ toolbar: GridToolbar }}
            rows={rows}
            columns={columns}
            autoHeight
          ></DataGrid>
        </Box>
      </Box>
    </Box>
  );
}

export default Users;
