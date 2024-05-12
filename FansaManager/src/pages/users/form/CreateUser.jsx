import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import Header from "../../../components/Header";
import { Formik } from "formik";
import * as yup from "yup";
import { createUser, getRoles } from "../../../services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  lowercaseRegex,
  numericRegex,
  uppercaseRegex,
} from "../../../Hooks/Regex";

function CreateUser() {
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    enabled: false,
    roles: [],
  };

  const userSchema = yup.object().shape({
    email: yup.string().required("email không được trống!"),
    password: yup
      .string()
      .matches(lowercaseRegex, "phải có ít nhất 1 chữ viết thường")
      .matches(uppercaseRegex, "phải có ít nhất 1 chữ viết in hoa")
      .matches(numericRegex, "phải có ít nhất 1 chữ số")
      .required("password không được trống!"),
    confirmPassword: yup
      .string()
      .required("Nhập lại mật khẩu không được trống!")
      .oneOf([yup.ref("password"), null], "Mật khẩu không khớp!"),
    name: yup.string().required("name không được trống!"),
  });
  const queryClient = useQueryClient();
  //FETCH ROLES
  const { data, isLoading, isError } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });
  const listRoles = data?.data;

  // MUTATION CREATE USER

  const mutationCreate = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.refetchQueries(["users"]);
      toast.success("Tạo user thành công");
      navigate("/users");
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

  const handleFormSubmit = async (values) => {
    mutationCreate.mutate(values);
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
      <Header title="CREATE USER" subtitle="Create a new User Profile" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={userSchema}
      >
        {({
          values,
          setValues,
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
                label="email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridRow: "1", gridColumn: "span 1" }}
              ></TextField>

              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridRow: "2", gridColumn: "span 1" }}
              ></TextField>

              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="confirm password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmPassword}
                name="confirmPassword"
                error={!!touched.confirmPassword && !!errors.confirmPassword}
                helperText={touched.confirmPassword && errors.confirmPassword}
                sx={{ gridRow: "3", gridColumn: "span 1" }}
              ></TextField>

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
                sx={{ gridRow: "4", gridColumn: "span 1" }}
              ></TextField>
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
              <FormGroup
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {listRoles.map((data) => (
                  <FormControlLabel
                    key={data.name}
                    label={data.name}
                    control={
                      <Checkbox
                        checked={values.roles.some(
                          (role) => role.id === data.id
                        )}
                        onChange={(event) => {
                          const isChecked = event.target.checked;
                          if (isChecked) {
                            setValues((prevValues) => ({
                              ...prevValues,
                              roles: [
                                ...prevValues.roles,
                                { id: data.id, name: data.name },
                              ],
                            }));
                          } else {
                            setValues((prevValues) => ({
                              ...prevValues,
                              roles: prevValues.roles.filter(
                                (role) => role.id !== data.id
                              ),
                            }));
                          }
                        }}
                        sx={{
                          "&.Mui-checked": {
                            color: "white",
                          },
                        }}
                      />
                    }
                  />
                ))}
              </FormGroup>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create new User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}

export default CreateUser;
