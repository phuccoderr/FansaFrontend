import { useEffect, useState } from "react";
import * as yup from "yup";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  CircularProgress,
} from "@mui/material";
import Header from "../../../components/Header";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getRoles, getUser, updateUser } from "../../../services/userService";
import { toast } from "react-toastify";

function UpdateUser() {
  const params = useParams();
  const userId = params.userId;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [listRoles, setListRoles] = useState([]);
  const [initialValues, setInitialValues] = useState({
    email: "",
    password: "",
    name: "",
    enabled: false,
    roles: [],
  });

  const userSchema = yup.object().shape({
    name: yup.string().required("required"),
  });

  //FETCH USERS WITH ID
  const fetchUsers = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });

  //FETCH ROLES

  const fetchRoles = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (fetchUsers.isSuccess && fetchRoles.isSuccess) {
      setInitialValues(fetchUsers.data.data);
      setListRoles(fetchRoles.data.data);
    }
  }, [userId, fetchUsers.isSuccess, fetchRoles.isSuccess]);

  const isLoading = fetchUsers.isLoading || fetchRoles.isLoading;
  const isError = fetchUsers.isError || fetchRoles.isError;

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

  // HTML
  return (
    <Box m="20px">
      <Header
        title={`UPDATA USER ${userId}`}
        subtitle={`Update user with name: ${initialValues.name}`}
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
                value={values.email}
                name="email"
                disabled
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
                sx={{ gridRow: "3", gridColumn: "span 1" }}
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
                {/* FETCH ROLES */}
                {listRoles?.map((data) => (
                  <FormControlLabel
                    key={data.name}
                    label={data.name}
                    control={
                      <Checkbox
                        checked={values.roles.some(
                          (role) => role.id == data.id
                        )}
                        disabled
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
                Update User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}

export default UpdateUser;
