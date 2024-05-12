import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteProduct, listProducts } from "../../services/productService";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Collapse,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  Modal,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import Header from "../../components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { Link, useNavigate } from "react-router-dom";
import DialogMUI from "../../components/DialogMUI";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import InfoIcon from "@mui/icons-material/Info";
import { styleModal, styleTextarea } from "./ProductStyle";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { toast } from "react-toastify";

function Products() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [openDiaLog, setOpenDiaLog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openCollapse, setOpenCollapse] = useState([
    { name: "product", open: true },
    { name: "description", open: false },
    { name: "images", open: false },
    { name: "details", open: false },
  ]);
  const [product, setProduct] = useState({});
  const [productId, setProductId] = useState(0);
  //GET USER
  const userLogin = JSON.parse(localStorage.getItem("user"));
  //FETCH PRODUCTS
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: listProducts,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });
  const products = data?.data;
  const handleClickOpen = (id) => {
    setOpenDiaLog(true);
    setProductId(id);
  };

  const handleClickOpenModal = (id) => {
    setOpenModal(true);
    products.forEach((pro) => {
      if (pro.id === id) {
        setProduct(pro);
      }
    });
  };
  const handleCloseModal = () => setOpenModal(false);

  const handleCollapse = (key) => {
    setOpenCollapse((prev) =>
      prev.map((item) => ({
        ...item,
        open: item.name === key ? !item.open : false,
      }))
    );
  };
  //DELETE PRODUCT
  const mutationDeleteProduct = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.refetchQueries(["products"]);
      toast.success("đã xoá thành công!");
      navigate("/products");
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
  const handleDeleteProduct = (id) => {
    mutationDeleteProduct.mutate(id);
    toast.warn("Đang cập nhật!");
  };

  const rows = products?.map((product) => ({
    id: product.id,
    main_image: product.main_image,
    name: product.name,
    price: product.price,
    enabled: product.enabled,
  }));
  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "main_image",
      headerName: "mainImage",
      width: 150,
      renderCell: ({ row }) => (
        <Box>
          <img src={row.main_image} alt="image" />
        </Box>
      ),
    },
    { field: "price", headerName: "price", width: 150 },
    { field: "enabled", headerName: "enabled", width: 150 },
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
            <Button
              sx={{ margin: "4px", padding: "4px" }}
              variant="contained"
              color="success"
              startIcon={<InfoIcon />}
              onClick={() => handleClickOpenModal(row.id)}
            >
              Detail
            </Button>
            <Link to={`/products/${row.id}`}>
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
              contentText="Bạn có chắc chắn xoá product này không ?"
              open={openDiaLog}
              setOpen={setOpenDiaLog}
              handleEvent={() => handleDeleteProduct(productId)}
            ></DialogMUI>
          </Box>
        );
      },
    },
  ];
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
      <Header title="PRODUCTS" subtitle="Managing the products" />
      <Link style={{ color: "white" }} to="/product">
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
      <Modal sx={styleModal} open={openModal}>
        <Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ margin: "0 5px" }}
            onClick={() => handleCollapse("product")}
            aria-expanded={openCollapse[0].open}
            aria-controls="collapseProduct"
          >
            Product
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ margin: "0 5px" }}
            onClick={() => handleCollapse("description")}
            aria-expanded={openCollapse[1].open}
            aria-controls="collapseDescription"
          >
            Description
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ margin: "0 5px" }}
            onClick={() => handleCollapse("images")}
            aria-expanded={openCollapse[2].open}
            aria-controls="collapseImages"
          >
            images
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ margin: "0 5px" }}
            onClick={() => handleCollapse("details")}
            aria-expanded={openCollapse[3].open}
            aria-controls="collapseDetails"
          >
            details
          </Button>
          <Button
            sx={{ float: "right" }}
            variant="contained"
            color="error"
            onClick={handleCloseModal}
          >
            Close
          </Button>
          <Collapse in={openCollapse[0].open} id="collapseProduct">
            <Typography variant="body1" sx={{ mt: 2 }}>
              ID: {product?.id}
            </Typography>
            <Typography sx={{ mt: 2 }}>Name: {product?.name}</Typography>
            <Typography sx={{ mt: 2 }}>Cost: {product?.cost}</Typography>
            <Typography sx={{ mt: 2 }}>Price: {product?.price}</Typography>
            <Typography sx={{ mt: 2 }}>Sale: {product?.sale}%</Typography>
            <Typography sx={{ mt: 2 }}>
              Enabled: <Checkbox disabled checked={product?.enabled} />
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <DatePicker
                disabled
                label="Create Time"
                defaultValue={dayjs(product?.createTime)}
              />
              <DatePicker
                label="Update Time"
                defaultValue={dayjs(product?.updateTime)}
              />
            </Box>
          </Collapse>
          <Collapse in={openCollapse[1].open} id="collapseDescription">
            <Typography sx={{ mt: 2 }}>Short Description</Typography>
            <TextareaAutosize
              style={styleTextarea}
              value={product?.short_description}
              minRows={3}
            />
            <Typography sx={{ mt: 2 }}>Full Description</Typography>
            <TextareaAutosize
              style={styleTextarea}
              value={product?.full_description}
              minRows={3}
            />
          </Collapse>
          <Collapse in={openCollapse[2].open} id="collapseImages">
            <Box>
              <ImageList sx={{ width: 900, height: 250 }}>
                <ImageListItem cols={2}>
                  <ListSubheader component="div">Product Images:</ListSubheader>
                </ImageListItem>
                <ImageListItem>
                  <img
                    src={product?.main_image}
                    alt="Main Image"
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title="Main Image"
                    subtitle="Hình ảnh đại diện của sản phẩm"
                    actionIcon={
                      <IconButton sx={{ color: "rgba(255, 255, 255, 0.54)" }}>
                        <InfoIcon />
                      </IconButton>
                    }
                  />
                </ImageListItem>
                {product?.extra_image?.map((item, index) => (
                  <ImageListItem key={item.img || index}>
                    <img src={item} loading="lazy" />
                    <ImageListItemBar
                      title="Extra Image"
                      subtitle="Hình ảnh phụ của sản phẩm"
                      actionIcon={
                        <IconButton sx={{ color: "rgba(255, 255, 255, 0.54)" }}>
                          <InfoIcon />
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          </Collapse>
          <Collapse in={openCollapse[3].open} id="collapseDetails">
            {product?.details?.map((detail) => (
              <Typography key={detail.id} variant="body1" sx={{ mt: 2 }}>
                Name: {detail?.name} - Value: {detail?.value}
              </Typography>
            ))}
          </Collapse>
        </Box>
      </Modal>
    </Box>
  );
}

export default Products;
