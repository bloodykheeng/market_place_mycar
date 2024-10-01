import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo
} from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllSparePartCarts,
  getSparePartCartById,
  postToSyncSpareCart,
  postSparePartCart,
  updateSparePartCart,
  deleteSparePartCartById
} from "../services/shopping-carts/spare-part-carts-service.js";
import useAuthContext from "./AuthContext";
import { postSparePartCartBulkDelete } from "../services/shopping-carts/spare-part-carts-service";
import { useNavigate } from "react-router-dom";

// Create the spare parts cart context
const SparePartsCartContext = createContext();

export const useSparePartsCart = () => useContext(SparePartsCartContext);

export const SparePartsCartProvider = ({ children }) => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  // const [sparePartsCartItems, setSparePartsCartItems] = useState([]);

  // Initialize cart from local storage or set to empty array
  const [sparePartsCartItems, setSparePartsCartItems] = useState(() => {
    const savedItems = localStorage.getItem("sparePartsCartItems");
    return savedItems ? JSON.parse(savedItems) : [];
  });

  const memorizedSparePartsCartItems = useMemo(() => {
    return sparePartsCartItems;
  }, [sparePartsCartItems]);

  // State hooks for loading indicators
  const [isPostSparePartCartLoading, setPostSparePartCartLoading] =
    useState(false);
  const [isUpdateSparePartCartLoading, setIsUpdateSparePartCartLoading] =
    useState(false);
  const [isDeleteSparePartCartLoading, setIsDeleteSparePartCartLoading] =
    useState(false);
  const [isPostToSyncSpareCartLoading, setIsPostToSyncSpareCartLoading] =
    useState(false);

  const { getUserQuery, logout, logoutMutation } = useAuthContext();

  const { data, isLoading, isError, error } = useQuery({
    enabled: getUserQuery?.data?.data ? true : false, // Only run the query if the user data is available
    queryKey: ["spare-parts-cart", getUserQuery?.data?.data?.id], // Unique key for caching and referencing the query
    queryFn: () =>
      getAllSparePartCarts({ user_id: getUserQuery?.data?.data?.id })
  });

  useEffect(() => {
    if (isError) {
      console.log("Error fetching Cars Cart :", error);
      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
        ? toast.warning("Check Your Internet Connection Please")
        : toast.error("An Error Occured Please Contact Admin");
    }
  }, [isError]);

  console.log("data in the cart is : ", data);

  // Mutation for posting spare part cart
  const postSparePartCartMutation = useMutation({
    mutationFn: postSparePartCart,
    onSuccess: () => {
      queryClient.invalidateQueries("spare-parts-cart");
      setPostSparePartCartLoading(false);
      // toast.success("Spare part cart added successfully!");
    },
    onError: (error) => {
      setPostSparePartCartLoading(false);
      console.error("Error posting spare part cart:", error);
      toast.error("Failed to add spare part cart.");
    }
  });

  // Mutation for updating spare part cart
  const updateSparePartCartMutation = useMutation({
    mutationFn: (variables) =>
      updateSparePartCart(variables?.spare_part_id, variables),
    onSuccess: () => {
      queryClient.invalidateQueries("spare-parts-cart");
      setIsUpdateSparePartCartLoading(false);
      // toast.success("Spare part cart updated successfully!");
    },
    onError: (error) => {
      setIsUpdateSparePartCartLoading(false);
      console.error("Error updating spare part cart:", error);
      toast.error("Failed to update spare part cart.");
    }
  });

  // Mutation for deleting spare part cart
  const deleteSparePartCartMutation = useMutation({
    mutationFn: deleteSparePartCartById,
    onSuccess: () => {
      queryClient.invalidateQueries("spare-parts-cart");
      setIsDeleteSparePartCartLoading(false);
      // toast.success("Spare part cart deleted successfully!");
    },
    onError: (error) => {
      setIsDeleteSparePartCartLoading(false);
      console.error("Error deleting spare part cart:", error);
      toast.error("Failed to delete spare part cart.");
    }
  });

  // Mutation for syncing spare part carts
  const postToSyncSpareCartMutation = useMutation({
    mutationFn: postToSyncSpareCart,
    onSuccess: (dataOnSync) => {
      queryClient.invalidateQueries("spare-parts-cart");
      setIsPostToSyncSpareCartLoading(false);
      setSparePartsCartItems(dataOnSync?.data?.data);
      console.log("Returned data on sync is:", dataOnSync);
      // toast.success("Spare parts carts synced successfully!");
    },
    onError: (error) => {
      setIsPostToSyncSpareCartLoading(false);
      console.error("Error syncing spare parts carts:", error);
      toast.error("Failed to sync spare parts carts.");
    }
  });

  const [cartBulkDeleteIsLoading, setCartBulkDeleteIsLoading] = useState(false);

  const sparePartCartBulkDeleteMutation = useMutation({
    mutationFn: postSparePartCartBulkDelete,
    onSuccess: () => {
      setCartBulkDeleteIsLoading(false);
      toast.success("Cart Cleared Successfully");
    },
    onError: (error) => {
      setCartBulkDeleteIsLoading(false);

      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
        ? toast.warning("Check Your Internet Connection Please")
        : toast.error("An Error Occured Please Contact Admin");
      console.log("create users error : ", error);
    }
  });

  // Effect to update local storage whenever the cart changes
  useEffect(() => {
    localStorage.setItem(
      "sparePartsCartItems",
      JSON.stringify(sparePartsCartItems)
    );
  }, [memorizedSparePartsCartItems]);

  // sync data
  useEffect(() => {
    const storedSparePartCartItems = localStorage.getItem(
      "sparePartsCartItems"
    );
    const sparePartCartItems = JSON.parse(storedSparePartCartItems);

    if (
      getUserQuery?.data?.data?.id &&
      sparePartCartItems &&
      Array.isArray(sparePartCartItems)
    ) {
      const organizedSparePartCartItems = sparePartCartItems.map((item) => ({
        spare_part_id: item?.id,
        selected_quantity: item?.selected_quantity,
        price: item?.price
      }));
      console.log("storedSparePartCartItems : ", sparePartCartItems);
      setIsPostToSyncSpareCartLoading(true);
      postToSyncSpareCartMutation.mutate({
        spare_part_carts: organizedSparePartCartItems
      });
    }
  }, [getUserQuery?.data?.data?.id]);

  const addToSparePartsCart = (item) => {
    setSparePartsCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        const newQuantity =
          existingItem.selected_quantity + item.selected_quantity;
        if (newQuantity > item.quantity) {
          toast.info(
            `Cannot add more than the available stock of ${item.name}!`
          );
          return prevItems;
        }
        toast.success(`${item.name} stock updated successfully!`);
        if (getUserQuery?.data?.data?.id) {
          const dataToUpdate = {
            user_id: getUserQuery?.data?.data?.id,
            spare_part_id: item.id,
            selected_quantity: newQuantity,
            price: item.price
          };
          setIsUpdateSparePartCartLoading(true);
          updateSparePartCartMutation.mutate(dataToUpdate);
        }
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, selected_quantity: newQuantity } : i
        );
      } else {
        toast.success(`${item.name} added to spare parts cart successfully!`);
        if (getUserQuery?.data?.data?.id) {
          const dataToPost = {
            user_id: getUserQuery?.data?.data?.id,
            spare_part_id: item.id,
            selected_quantity: item.selected_quantity,
            price: item.price
          };
          setPostSparePartCartLoading(true);
          postSparePartCartMutation.mutate(dataToPost);
        }
        return [
          ...prevItems,
          { ...item, selected_quantity: item.selected_quantity }
        ];
      }
    });
  };

  const removeFromSparePartsCart = (id) => {
    setSparePartsCartItems((prevItems) => {
      const itemToRemove = prevItems.find((i) => i.id === id);
      if (itemToRemove) {
        toast.success(
          `${itemToRemove.name} removed from spare parts cart successfully!`
        );
        if (getUserQuery?.data?.data?.id) {
          setIsDeleteSparePartCartLoading(true);
          deleteSparePartCartMutation.mutate(id);
        }
      }
      return prevItems.filter((item) => item.id !== id);
    });
  };

  // const clearSparePartsCart = () => {
  //   setSparePartsCartItems([]);
  //   toast.info("Spare parts cart cleared.");
  // };

  const clearSparePartsCart = () => {
    if (
      !Array.isArray(sparePartsCartItems) ||
      sparePartsCartItems.length === 0
    ) {
      toast.info("Spare parts cart is already empty.");
      return;
    }

    if (getUserQuery?.data?.data) {
      //if logged in

      setCartBulkDeleteIsLoading(true);

      const idsToDelete = sparePartsCartItems.map((item) => item.id);
      sparePartCartBulkDeleteMutation.mutate(idsToDelete);

      setSparePartsCartItems([]);
      localStorage.removeItem("sparePartsCartItems");
      navigate("/");
    } else {
      // if not logged in
      setSparePartsCartItems([]);
      localStorage.removeItem("sparePartsCartItems");
    }
  };

  return (
    <SparePartsCartContext.Provider
      value={{
        sparePartsCartItems,
        isPostToSyncSpareCartLoading,
        addToSparePartsCart,
        removeFromSparePartsCart,
        clearSparePartsCart
      }}
    >
      {children}
    </SparePartsCartContext.Provider>
  );
};

export default SparePartsCartProvider;
