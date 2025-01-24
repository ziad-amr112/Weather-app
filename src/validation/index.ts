export const SearchValidation = (data: { NameCity: string }) => {
  const errors: { NameCity: string } = {
    NameCity: "",
  };

  if (!data.NameCity.trim()) {
    errors.NameCity = "City is required!";
  }

  return errors;
};
