import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchUsers } from "@/features/app/admin/manage-reviewees/actions/fetch-users.action";
import type { Reviewee } from "@/features/app/admin/manage-reviewees/types/reviewee";

const ITEMS_PER_PAGE = 10;

export const useAdminManageReviewees = () => {
  const [users, setUsers] = useState<Reviewee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isUserFormModalOpen, setIsUserFormModalOpen] = useState(false);
  const [revieweeToEdit, setRevieweeToEdit] = useState<Reviewee | null>(null);
  const [revieweeToResend, setRevieweeToResend] = useState<Reviewee | null>(
    null,
  );
  const [selectedPaymentPath, setSelectedPaymentPath] = useState<string | null>(
    null,
  );
  const [selectedRevieweeName, setSelectedRevieweeName] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const requestSequence = useRef(0);

  const loadUsers = useCallback(async () => {
    const requestId = ++requestSequence.current;
    setIsLoading(true);

    try {
      const result = await fetchUsers();
      if (requestId !== requestSequence.current) return;

      if (!result.success) {
        setUsers([]);
        setUsersError(result.error ?? "Unable to fetch reviewees.");
      } else {
        setUsers(result.users as Reviewee[]);
        setUsersError("");
      }
    } catch {
      if (requestId !== requestSequence.current) return;
      setUsers([]);
      setUsersError("Unable to fetch reviewees.");
    } finally {
      if (requestId === requestSequence.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let isCurrentEffect = true;
    void Promise.resolve().then(() => {
      if (isCurrentEffect) {
        void loadUsers();
      }
    });

    return () => {
      isCurrentEffect = false;
      requestSequence.current += 1;
    };
  }, [loadUsers]);

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

  const openPaymentModal = (user: Reviewee) => {
    setSelectedPaymentPath(user.payment_image_path);
    setSelectedRevieweeName(user.full_name);
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => setIsPaymentModalOpen(false);

  return {
    closePaymentModal,
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
    isLoading,
    isPaymentModalOpen,
    isUserFormModalOpen,
    lastItem: Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length),
    noticeMessage,
    openEditModal,
    openPaymentModal,
    openRegisterModal,
    openResendInvitationModal: setRevieweeToResend,
    paginatedUsers,
    refreshUsers: loadUsers,
    revieweeToEdit,
    revieweeToResend,
    searchQuery,
    selectedPaymentPath,
    selectedRevieweeName,
    setCurrentPage,
    setSearchQuery: (query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
    },
    showNotice: handleInvitationNotice,
    totalPages,
  };
};
