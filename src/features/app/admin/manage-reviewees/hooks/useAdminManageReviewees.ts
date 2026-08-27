import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/features/app/admin/manage-reviewees/actions/fetch-users.action";
import type { Reviewee } from "@/features/app/admin/manage-reviewees/types/reviewee";

const ITEMS_PER_PAGE = 10;
const EMPTY_REVIEWEES: Reviewee[] = [];

export const useAdminManageReviewees = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isUserFormModalOpen, setIsUserFormModalOpen] = useState(false);
  const [revieweeToEdit, setRevieweeToEdit] = useState<Reviewee | null>(null);
  const [revieweeToResend, setRevieweeToResend] = useState<Reviewee | null>(
    null,
  );
  const [noticeMessage, setNoticeMessage] = useState("");
  const usersQuery = useQuery({
    gcTime: Infinity,
    queryFn: async (): Promise<Reviewee[]> => {
      const result = await fetchUsers();

      if (!result.success) {
        throw new Error(result.error ?? "Unable to fetch reviewees.");
      }

      return result.users as Reviewee[];
    },
    queryKey: ["admin", "reviewees"],
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    retry: false,
    staleTime: 0,
  });
  const users = usersQuery.data ?? EMPTY_REVIEWEES;
  const usersError =
    usersQuery.isError && usersQuery.data === undefined
      ? usersQuery.error instanceof Error
        ? usersQuery.error.message
        : "Unable to fetch reviewees."
      : "";
  const { refetch: refetchUsers } = usersQuery;
  const loadUsers = useCallback(async () => {
    await refetchUsers();
  }, [refetchUsers]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timeout = window.setTimeout(() => setNoticeMessage(""), 5000);
    return () => window.clearTimeout(timeout);
  }, [noticeMessage]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return users;

    return users.filter(
      (user) =>
        user.full_name.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery),
    );
  }, [searchQuery, users]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / ITEMS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleUserSaved = async (message: string) => {
    setIsUserFormModalOpen(false);
    setRevieweeToEdit(null);
    setNoticeMessage(message);
    await loadUsers();
  };

  const handleInvitationNotice = (message: string) => {
    setNoticeMessage(message);
    void loadUsers();
  };

  const openRegisterModal = () => {
    setRevieweeToEdit(null);
    setIsUserFormModalOpen(true);
  };

  const openEditModal = (user: Reviewee) => {
    setRevieweeToEdit(user);
    setIsUserFormModalOpen(true);
  };

  const closeUserFormModal = () => setIsUserFormModalOpen(false);

  return {
    closeResendInvitationModal: () => setRevieweeToResend(null),
    closeUserFormModal,
    currentPage: safeCurrentPage,
    emptyMessage:
      usersError ||
      (searchQuery
        ? "No users match your search."
        : "No users have been registered yet."),
    filteredUsers,
    firstItem: filteredUsers.length ? startIndex + 1 : 0,
    handleUserSaved,
    isLoading: usersQuery.isPending,
    isRefreshing: usersQuery.isFetching,
    isUserFormModalOpen,
    lastItem: Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length),
    hideNotice: () => setNoticeMessage(""),
    noticeMessage,
    openEditModal,
    openRegisterModal,
    openResendInvitationModal: setRevieweeToResend,
    paginatedUsers,
    refreshUsers: loadUsers,
    revieweeToEdit,
    revieweeToResend,
    searchQuery,
    setCurrentPage,
    setSearchQuery: (query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
    },
    showNotice: handleInvitationNotice,
    totalPages,
  };
};
