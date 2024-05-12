import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCategory, listCategories } from "../../services/categoryService";
import { Box, Button, CircularProgress } from "@mui/material";
import Header from "../../components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { Link } from "react-router-dom";
import { useState } from "react";
import DialogMUI from "../../components/DialogMUI";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { toast } from "react-toastify";

function Categories() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [cateId, setCateId] = useState(0);
  const queryClient = useQueryClient();
  //GET USER
  const userLogin = JSON.parse(localStorage.getItem("user"));
  // FETCH CATEGORY
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });
  const categories = data?.data;
  const rows = categories?.map((cate) => ({
    id: cate.id,
    name: cate.name,
    image: cate.image,
    parentId: cate.parentId,
  }));
  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "image",
      headerName: "Image",
      width: 150,
      renderCell: ({ row }) => (
        <Box>
          <img src={row.image} alt="image" />
        </Box>
      ),
    },
    { field: "parentId", headerName: "Parent", width: 150 },
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
            <Link to={`/categories/${row.id}`}>
              <Button
                sx={{ margin: "4px", padding: "4px" }}
                variant="contained"
                color="primary"
                startIcon={<EditNoteIcon />}
                disabled={userLogin.roles.some((role) => role.name !== "ADMIN")}
              >
                Edit User
              </Button>
            </Link>

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
            <DialogMUI
              title="Remove"
              contentText="Bạn có chắc chắn xoá category này không ?"
              open={open}
              setOpen={setOpen}
              handleEvent={() => handleDeleteCategory(cateId)}
            ></DialogMUI>
          </Box>
        );
      },
    },
  ];

  // DELETE CATEGORY
  const mutationCate = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.refetchQueries(["categories"]);
      toast.success("Đã xoá category thành công!");
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
    setCateId(id);
    setOpen(true);
  };

  const handleDeleteCategory = (id) => {
    mutationCate.mutate(id);
  };

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

  return (
    <Box m={2}>
      <Header title="CATEGORY" subtitle="Managing the categories" />
      <Link style={{ color: "white" }} to="/category">
        <Button
          sx={{ backgroundColor: "green", marginTop: "10px" }}
          variant="primary"
        >
          Add{" "}
        </Button>
      </Link>
      <Box
        m="20px 0 0 0"
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
        <DataGrid
          slots={{ toolbar: GridToolbar }}
          rows={rows}
          columns={columns}
          autoHeight
        ></DataGrid>
      </Box>
    </Box>
  );
}

export default Categories;
