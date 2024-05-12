import * as yup from "yup";
import {
  lowercaseRegex,
  numericRegex,
  uppercaseRegex,
} from "../../../Hooks/Regex";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRoles, getUser, updateUser } from "../../../services/userService";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import Header from "../../../components/Header";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Account() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    email: "",
    name: "",
    enabled: false,
    roles: [],
  });
  const [listRoles, setListRoles] = useState([]);

  const userSchema = yup.object().shape({
    name: yup.string().required("name không được trống!"),
  });

  //GET USER
  const userLogin = JSON.parse(localStorage.getItem("user"));
  const userId = userLogin.id;

  //FETCH ROLES
  const fetchRoles = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });
  //FETCH USER LOGIN
  const fetchUser = useQuery({
    queryKey: ["account"],
    queryFn: () => getUser(userId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (fetchUser.isSuccess && fetchRoles.isSuccess) {
      setInitialValues(fetchUser.data.data);
      setListRoles(fetchRoles.data.data);
    }
  }, [fetchUser.isSuccess, fetchRoles.isSuccess]);

  const isLoading = fetchUser.isLoading || fetchRoles.isLoading;
  const isError = fetchUser.isError || fetchRoles.isError;

  // Submit
  const mutateUpdateUser = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.refetchQueries(["users"]);
      toast.success("Cập nhật user thành công!");
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
    mutateUpdateUser.mutate({ id: userId, data: values });
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
        title="PROFILE ABOUT YOU"
        subtitle={`Setting profile ${initialValues.name}`}
      />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={userSchema}
        enableReinitialize={true}
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

export default Account;
