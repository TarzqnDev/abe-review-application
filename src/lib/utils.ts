export const handleFormChange =
  (formData: any, setFormData: any) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
