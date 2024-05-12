import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCategory,
  listCategories,
  updateCategory,
} from "../../services/categoryService";
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
import { Formik } from "formik";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import { hierarachical } from "./common";

function UpdateCategory() {
  const queryClient = useQueryClient();
  const params = useParams();
  const cateId = params.cateId;
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    name: "",
    parentId: 0,
    enabled: false,
  });
  const [image, setImage] = useState("");
  const [newImage, setNewImage] = useState("");
  // GET LIST IN FORM CATEGORIES
  const fetchCategories = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });
  const categories = fetchCategories.data?.data;
  const resultHierarchical = hierarachical(categories ?? []);

  // GET CATEGORY WITH PARAM id
  const fetchCategory = useQuery({
    queryKey: ["category", cateId],
    queryFn: () => getCategory(cateId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });
  useEffect(() => {
    if (fetchCategory.isSuccess) {
      setInitialValues(() => ({
        name: fetchCategory.data?.data.name,
        parentId: fetchCategory?.data.parentId,
        enabled: fetchCategory?.data.enabled,
      }));
      setImage(fetchCategory?.data.image);
    }
  }, [fetchCategory.isSuccess]);
  const isLoading = fetchCategories.isLoading || fetchCategory.isLoading;
  const isError = fetchCategories.isError || fetchCategory.isError;
  // POST CATEGORY WITH ID
  const mutationUpdate = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.refetchQueries(["categories"]);
      toast.success("Cập nhật category thành công!");
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

  const handleSubmit = (values) => {
    mutationUpdate.mutate({ id: cateId, data: values, fileImage: newImage });
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
    <Box m="20px">
      <Header
        title={`UPDATA CATEGORY ${cateId}`}
        subtitle={`Update user with name: ${initialValues.name}`}
      ></Header>
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        enableReinitialize={true}
      >
        {({ values, handleBlur, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="30px">
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                name="name"
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
                  setNewImage(files);
                }}
              />

              {newImage ? (
                <img
                  src={URL.createObjectURL(newImage)}
                  width={100}
                  height={100}
                  alt=""
                />
              ) : (
                <img src={image} width={100} height={100} alt="" />
              )}

              <TextField
                variant="filled"
                select
                label="parentCategory"
                name="parentId"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.parentId ? values.parentId : 0}
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
                Update User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}

export default UpdateCategory;
