import * as yup from "yup";

export const editProfileSchema = yup.object().shape({
  username: yup.string().min(3).max(30).required(),
  about: yup.string().max(20).required(),
});
