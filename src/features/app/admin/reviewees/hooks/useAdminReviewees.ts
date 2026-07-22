import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchUsers } from "@/features/app/admin/reviewees/actions/fetch-users.action";
import type { Reviewee } from "@/features/app/admin/reviewees/types/reviewee";

const ITEMS_PER_PAGE = 10;

export const useAdminReviewees = () => {
  const [users, setUsers] = useState<Reviewee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedPaymentPath, setSelectedPaymentPath] = useState<string | null>(
    null,
  );
  const [selectedRevieweeName, setSelectedRevieweeName] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchUsers();

    if (!result.success) {
      setUsers([]);
      setUsersError(result.error ?? "Unable to fetch reviewees.");
    } else {
      setUsers(result.users as Reviewee[]);
      setUsersError("");
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isCurrentRequest = true;
    void fetchUsers().then((result) => {
      if (!isCurrentRequest) return;
      if (!result.success) {
        setUsers([]);
        setUsersError(result.error ?? "Unable to fetch reviewees.");
      } else {
        setUsers(result.users as Reviewee[]);
        setUsersError("");
      }
      setIsLoading(false);
    });
    return () => {
      isCurrentRequest = false;
    };
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const timeout = window.setTimeout(() => setSuccessMessage(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [successMessage]);

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

  const handleRegistered = async (message: string) => {
    setIsRegisterModalOpen(false);
    setSuccessMessage(message);
    await loadUsers();
  };

  const openPaymentModal = (user: Reviewee) => {
    setSelectedPaymentPath(user.payment_image_path);
    setSelectedRevieweeName(user.full_name);
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => setIsPaymentModalOpen(false);

  return {
    closePaymentModal,
    closeRegisterModal: () => setIsRegisterModalOpen(false),
    currentPage: safeCurrentPage,
    emptyMessage:
      usersError ||
      (searchQuery
        ? "No users match your search."
        : "No users have been registered yet."),
    filteredUsers,
    firstItem: filteredUsers.length ? startIndex + 1 : 0,
    handleRegistered,
    isLoading,
    isPaymentModalOpen,
    isRegisterModalOpen,
    lastItem: Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length),
    openPaymentModal,
    openRegisterModal: () => setIsRegisterModalOpen(true),
    paginatedUsers,
    searchQuery,
    selectedPaymentPath,
    selectedRevieweeName,
    setCurrentPage,
    setSearchQuery: (query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
    },
    successMessage,
    totalPages,
  };
};
