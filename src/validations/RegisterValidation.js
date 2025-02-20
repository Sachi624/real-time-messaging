import * as yup from "yup";

export const registerSchema = yup.object().shape({
  username: yup.string().min(3).max(30).required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).max(10).required(),
  rePassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "passwords must match"),
});
