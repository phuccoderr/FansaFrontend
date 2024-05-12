import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  MenuItem,
  TextField,
} from "@mui/material";
import * as yup from "yup";
import Header from "../../components/Header";
import { Formik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { createCategory, listCategories } from "../../services/categoryService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { hierarachical } from "./common";
function CreateCategory() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    parentId: 0,
    enabled: false,
  };
  const [image, setImage] = useState("");

  // GET LIST IN FORM CATEGORIES
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });
  const categories = data?.data;
  const resultHierarchical = hierarachical(categories ?? []);
  // POST CATEGORY
  const mutationCreate = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.refetchQueries(["categories"]);
      toast.success("Cập nhật user thành công!");
      navigate("/categories");
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

  const cateSchema = yup.object().shape({
    name: yup.string().required("name không được trống!"),
  });

  const handleSubmit = (values) => {
    // mutationCreate.mutate(values);
    console.log("values", values);
    console.log("image", image);
    mutationCreate.mutate({ data: values, fileImage: image });
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
    <Box m="20px">
      <Header
        title="CREATE CATEGORY"
        subtitle={`Create category for product`}
      ></Header>
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={cateSchema}
        enableReinitialize={true}
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
            <Box display="grid" gap="30px">
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
                sx={{ gridRow: "1", gridColumn: "span 1" }}
              ></TextField>
              <input
                accept="image/*"
                id="contained-button-file"
                type="file"
                name="image"
                label="image"
                onBlur={handleBlur}
                onChange={(e) => {
                  const files = e.target.files[0];
                  setImage(files);
                }}
              />

              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  width={100}
                  height={100}
                  alt=""
                />
              )}

              <TextField
                variant="filled"
                select
                label="parentCategory"
                name="parentId"
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
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Category
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}

export default CreateCategory;
