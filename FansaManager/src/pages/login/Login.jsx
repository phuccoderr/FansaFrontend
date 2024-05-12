import { Box, Button, TextField, useTheme, Alert } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../../services/login";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [errorMessage,setErrorMesage] = useState('');
  const initialValues = {
    email: "",
    password: "",
  };
  const userSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
  });

  const handleFormSubmit = async (values) => {
    mutationLogin.mutate(values);
  };
  // MUTATION LOGIN
  const mutationLogin = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data, variables, context) => {
      localStorage.setItem("access_token", data.data.accessToken)
      localStorage.setItem("user",JSON.stringify(data.data.user))
      toast.success("Login Successfully!");
      window.location.href = "/";
    },
    onError: (data,variables, context) => {
      setErrorMesage('Tài khoản hoặc mật khẩu không tồn tại!')
    }
  });


  return (
    <Box m="20px">
      <Header title="Login User" subtitle="Login user" />
      {errorMessage && <Alert variant="outlined" severity="error" sx={{margin: '5px 0',padding: '0 16px'}} >{errorMessage}</Alert>} 
      <Box>
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
                ></TextField>
              </Box>
              <Box display="flex" justifyContent="center" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Login
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}

export default Login;
