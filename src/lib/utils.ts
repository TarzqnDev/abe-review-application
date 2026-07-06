import type { ChangeEvent, Dispatch, SetStateAction } from "react";

export const handleFormChange =
  <FormData extends Record<string, string>>(
    formData: FormData,
    setFormData: Dispatch<SetStateAction<FormData>>,
  ) =>
  (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
