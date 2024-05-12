import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Collapse,
  FormControlLabel,
  FormGroup,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  MenuItem,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Header from "../../components/Header";
import * as yup from "yup";
import { styleTextarea } from "./ProductStyle";
import { FieldArray, Formik } from "formik";
import InfoIcon from "@mui/icons-material/Info";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../../services/productService";
import { toast } from "react-toastify";
import { hierarachical } from "../category/common";
import { useNavigate } from "react-router-dom";
import { listCategories } from "../../services/categoryService";

function CreateProduct() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [openCollapse, setOpenCollapse] = useState([
    { name: "product", open: true },
    { name: "description", open: false },
    { name: "images", open: false },
    { name: "details", open: false },
  ]);

  const [initialValues, setInitialValues] = useState({
    name: "",
    cost: 0,
    price: 0,
    sale: 0,
    enabled: true,
    short_description: "",
    full_description: "",
    details: [
      {
        name: "",
        value: "",
      },
    ],
    category: 0,
  });

  const [mainImage, setMainImage] = useState("");
  const [extraImage, setExtraImage] = useState([]);

  const productSchema = yup.object().shape({
    name: yup.string().required("name không được trống!"),
    short_description: yup.string().required("mô tả ngắn không được trống!"),
    full_description: yup.string().required("mô tả đầy đủ không được trống!"),
  });

  const handleCollapse = (key) => {
    setOpenCollapse((prev) =>
      prev.map((item) => ({
        ...item,
        open: item.name === key ? !item.open : false,
      }))
    );
  };
  // GET LIST IN FORM CATEGORIES
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });
  const categories = data?.data;
  const resultHierarchical = hierarachical(categories ?? []);
  // MUTATION CREATE
  const mutationCreate = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.refetchQueries(["products"]);
      toast.success("đã thêm thành công!");
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

  const handleFormSubmit = (values) => {
    mutationCreate.mutate({
      data: values,
      mainImage: mainImage,
      extraImage: extraImage,
    });
    toast.warn("Đang cập nhật!");
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
      <Header title="CREATE PRODUCT" subtitle="Create product for customer" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={productSchema}
      >
        {({
          values,
          setFieldValue,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
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
              <Collapse in={openCollapse[0].open} id="collapseProduct">
                <Box display="grid" gap={2}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    name="name"
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    variant="filled"
                    select
                    label="category"
                    name="category"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    SelectProps={{ defaultValue: 0 }}
                  >
                    <MenuItem value={0}>Default</MenuItem>
                    {resultHierarchical.map((cate) => [
                      <MenuItem key={cate.id} value={cate.id}>
                        {cate.name}
                      </MenuItem>,
                    ])}
                  </TextField>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    label="cost"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.cost}
                    name="cost"
                  />

                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    label="price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.price}
                    name="price"
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="number"
                    label="sale"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.sale}
                    name="sale"
                  />
                  <FormGroup>
                    <FormControlLabel
                      checked={values.enabled}
                      name="enabled"
                      onChange={handleChange}
                      control={
                        <Checkbox
                          sx={{
                            "&.Mui-checked": {
                              color: "white",
                            },
                          }}
                        />
                      }
                      label="enabled"
                    />
                  </FormGroup>
                </Box>
              </Collapse>
              <Collapse in={openCollapse[1].open} id="collapseDescription">
                <Typography sx={{ mt: 2 }}>Short Description</Typography>
                <TextareaAutosize
                  style={styleTextarea}
                  placeholder="Nhập tóm tắt mô tả"
                  minRows={3}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="short_description"
                  value={values.short_description}
                />
                <Typography sx={{ mt: 2 }}>Full Description</Typography>
                <TextareaAutosize
                  style={styleTextarea}
                  placeholder="Nhập đầy đủ mô tả"
                  minRows={3}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="full_description"
                  value={values.full_description}
                />
              </Collapse>
              <Collapse in={openCollapse[2].open} id="collapseImages">
                <Box display="flex" gap={5}>
                  <Box>
                    <input
                      accept="image/*"
                      id="contained-button-file"
                      type="file"
                      name="image"
                      label="mainImage"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const files = e.target.files[0];
                        setMainImage(files);
                      }}
                    />
                    {mainImage && (
                      <ImageList>
                        <ImageListItem>
                          <img
                            src={URL.createObjectURL(mainImage)}
                            alt="Main Image"
                            loading="lazy"
                          />
                          <ImageListItemBar
                            title="Main Image"
                            subtitle="Hình ảnh đại diện của sản phẩm"
                            actionIcon={
                              <IconButton
                                sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                              >
                                <InfoIcon />
                              </IconButton>
                            }
                          />
                        </ImageListItem>
                      </ImageList>
                    )}
                  </Box>
                  <Box>
                    <input
                      accept="image/*"
                      id="contained-button-file"
                      type="file"
                      multiple
                      name="extraImage"
                      label="extraImage"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const files = e.target.files;
                        const fileList = [];
                        for (let i = 0; i < files.length; i++) {
                          fileList.push(files[i]);
                        }
                        setExtraImage(fileList);
                      }}
                    />
                    {extraImage && (
                      <ImageList sx={{ width: 500, height: 250 }}>
                        {extraImage?.map((item, index) => (
                          <ImageListItem key={item.img || index}>
                            <img
                              src={URL.createObjectURL(item)}
                              loading="lazy"
                            />
                            <ImageListItemBar
                              title="Extra Image"
                              subtitle="Hình ảnh phụ của sản phẩm"
                              actionIcon={
                                <IconButton
                                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                >
                                  <InfoIcon />
                                </IconButton>
                              }
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    )}
                  </Box>
                </Box>
              </Collapse>
              <Collapse in={openCollapse[3].open} id="collapseDetails">
                <Box m={2}>
                  <FieldArray name="details">
                    {({ push, remove }) => (
                      <>
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={() => push({ name: "", value: "" })}
                        >
                          Add
                        </Button>
                        {values.details.map((detail, index) => (
                          <Box key={index} display="flex" gap={2} m={2}>
                            <TextField
                              sx={{ width: "50%" }}
                              variant="filled"
                              type="text"
                              label="name"
                              name={`details.${index}.name`}
                              value={detail.name}
                              onChange={(e) => {
                                const updateDetails = [...values.details];
                                updateDetails[index].name = e.target.value;
                                setFieldValue("details", updateDetails);
                              }}
                            ></TextField>

                            <TextField
                              sx={{ width: "50%" }}
                              variant="filled"
                              name={`details.${index}.value`}
                              value={detail.value}
                              label="Value"
                              type="text"
                              onChange={(e) => {
                                const updatedDetails = [...values.details];
                                updatedDetails[index].value = e.target.value;
                                setFieldValue("details", updatedDetails);
                              }}
                            />
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </Button>
                          </Box>
                        ))}
                      </>
                    )}
                  </FieldArray>
                </Box>
              </Collapse>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create new Product
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}

export default CreateProduct;
