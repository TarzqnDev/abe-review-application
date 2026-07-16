import { useState } from "react";

export const useAdminTrivias = () => {
  const [isCreateTriviaModalOpen, setIsCreateTriviaModalOpen] = useState(false);

  const handleOpenCreateTriviaModal = () => {
    setIsCreateTriviaModalOpen(true);
  };

  const handleCloseCreateTriviaModal = () => {
    setIsCreateTriviaModalOpen(false);
  };

  return {
    handleCloseCreateTriviaModal,
    handleOpenCreateTriviaModal,
    isCreateTriviaModalOpen,
  };
};
