import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo
} from "react";
import { toast } from "react-toastify";

import { useQuery } from "@tanstack/react-query";
import {
  getAllCarCarts,
  getCarCartById,
  postToSyncCarCart,
  postCarCart,
  updateCarCart,
  deleteCarCartById
} from "../services/shopping-carts/car-carts-service.js";
import useAuthContext from "./AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Create the cart context
const CarCartContext = createContext();

export const useCarCart = () => useContext(CarCartContext);

export const CarCartProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const [isPostCarCartMutationLaoding, setPostCarCartMutationIsLoading] =
    useState(false);
  const [isUpdateCarCartMutationLaoding, setIsUpdateCarCartMutationLoading] =
    useState(false);
  const [isDeleteCarCartMutationLaoding, setIsDeleteCarCartMutationLoading] =
    useState(false);
  const [
    isPostToSyncCarCartMutationLoading,
    setPostToSyncCarCartMutationIsLoading
  ] = useState(false);

  // const [carCartItems, setCarCartItems] = useState(() => {
  //   // Load cart items from local storage when the component initializes
  //   const savedCartItems = localStorage.getItem("carCartItems");
  //   console.log("savedCartItems", savedCartItems);

  //   return savedCartItems && savedCartItems !== "undefined"
  //     ? JSON.parse(savedCartItems)
  //     : [];
  // });


  const [carCartItems, setCarCartItems] = useState([]);
  
  const memorizedCarCartItems = useMemo(() => {
    return carCartItems;
  }, [carCartItems]);
  //
  const { getUserQuery, logout, logoutMutation } = useAuthContext();

  //
  const { data, isLoading, isError, error } = useQuery({
    enabled: getUserQuery?.data?.data ? true : false,
    queryKey: ["cars-cart", getUserQuery?.data?.data?.id],
    queryFn: () => getAllCarCarts({ user_id: getUserQuery?.data?.data?.id })
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

  //
  const postCarCartMutation = useMutation({
    mutationFn: postCarCart,
    onSuccess: () => {
      queryClient.invalidateQueries("cars-cart");
      setPostCarCartMutationIsLoading(true);
      // Optionally, you can show a success toast or perform any other actions
      // toast.success("Car cart created successfully!");
    },
    onError: (error) => {
      // Handle error, show error toast, etc.
      setPostCarCartMutationIsLoading(true);
      console.error("Error creating car cart:", error);
      toast.error("Failed to create car cart.");
    }
  });

  const updateCarCartMutation = useMutation({
    mutationFn: (variables) => updateCarCart(variables?.car_id, variables),
    onSuccess: () => {
      queryClient.invalidateQueries("cars-cart");
      setIsUpdateCarCartMutationLoading(true);
      // Optionally, you can show a success toast or perform any other actions
      // toast.success("Car cart updated successfully!");
    },
    onError: (error) => {
      setIsUpdateCarCartMutationLoading(true);
      // Handle error, show error toast, etc.
      console.error("Error updating car cart:", error);
      toast.error("Failed to update car cart.");
    }
  });

  const deleteCarCartMutation = useMutation({
    mutationFn: deleteCarCartById,
    onSuccess: () => {
      queryClient.invalidateQueries("cars-cart");
      setIsDeleteCarCartMutationLoading(false);
      // toast.success("Car cart deleted successfully!");
    },
    onError: (error) => {
      setIsDeleteCarCartMutationLoading(false);
      console.error("Error deleting car cart:", error);
      toast.error("Failed to delete car cart.");
    }
  });

  const postToSyncCarCartMutation = useMutation({
    mutationFn: postToSyncCarCart,
    onSuccess: (dataOnSync) => {
      queryClient.invalidateQueries("cars-cart");
      setPostToSyncCarCartMutationIsLoading(false);
      setCarCartItems(dataOnSync?.data?.data);
      // Optionally, you can show a success toast or perform any other actions
      // toast.success("Car carts synced successfully!");
      console.log("retured data on sync is : ", dataOnSync);
    },
    onError: (error) => {
      // Handle error, show error toast, etc.
      setPostToSyncCarCartMutationIsLoading(false);
      console.error("Error syncing car carts:", error);
      toast.error("Failed to sync car carts.");
    }
  });

  console.log("memorizedCarCartItems is : ", memorizedCarCartItems);

  // useEffect(() => {
  //   // Save cart items to local storage whenever they change
  //   localStorage.setItem("carCartItems", JSON.stringify(memorizedCarCartItems));
  // }, [memorizedCarCartItems]);

  // useEffect(() => {
  //   const storedCarCartItems = localStorage.getItem("carCartItems");
  //   const carCartItems = JSON.parse(storedCarCartItems);

  //   if (
  //     getUserQuery?.data?.data?.id &&
  //     carCartItems &&
  //     Array.isArray(carCartItems)
  //   ) {
  //     const organizedCarCartItems = carCartItems.map((item) => ({
  //       car_id: item?.id,
  //       selected_quantity: item?.selected_quantity,
  //       price: item?.price
  //     }));

  //     console.log("storedCarCartItems : ", carCartItems);
  //     setPostToSyncCarCartMutationIsLoading(true);
  //     postToSyncCarCartMutation.mutate({
  //       car_carts: organizedCarCartItems
  //     });
  //   }
  // }, [getUserQuery?.data?.data?.id]);

  // const [carCartItems, setCarCartItems] = useState([]);

  //

  const addToCarCart = (item) => {
    setCarCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        const newQuantity =
          existingItem.selected_quantity + item.selected_quantity;
        if (newQuantity > item.quantity) {
          toast.info(
            `Cannot add more than the available stock of ${item.name}!`
          );
          return prevItems;
        } else {
          toast.success(`${item.name} stock updated successfully!`);
          if (getUserQuery?.data?.data?.id) {
            let dataToUpdate = {
              user_id: getUserQuery?.data?.data?.id,
              car_id: item?.id,
              selected_quantity: newQuantity,
              price: item?.price
            };
            setIsUpdateCarCartMutationLoading(true);
            updateCarCartMutation.mutate(dataToUpdate);
          }

          return prevItems.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  selected_quantity: newQuantity
                }
              : i
          );
        }
      } else {
        toast.success(`${item.name} added to cart successfully!`);
        if (getUserQuery?.data?.data?.id) {
          let dataToPost = {
            user_id: getUserQuery?.data?.data?.id,
            car_id: item?.id,
            selected_quantity: item?.selected_quantity,
            price: item?.price
          };
          setPostCarCartMutationIsLoading(true);
          postCarCartMutation.mutate(dataToPost);
        }
        return [
          ...prevItems,
          { ...item, selected_quantity: item.selected_quantity }
        ];
      }
    });
  };

  const removeFromCarCart = (id) => {
    setCarCartItems((prevItems) => {
      const itemToRemove = prevItems.find((i) => i.id === id);

      if (itemToRemove) {
        toast.success(`${itemToRemove.name} removed from cart successfully!`);
        if (getUserQuery?.data?.data?.id) {
          setIsDeleteCarCartMutationLoading(true);
          deleteCarCartMutation.mutate(itemToRemove?.id);
        }
      }
      return prevItems.filter((item) => item.id !== id);
    });
  };

  const clearCarCart = () => {
    setCarCartItems([]);
  };

  return (
    <CarCartContext.Provider
      value={{
        carCartItems,
        isPostToSyncCarCartMutationLoading,
        addToCarCart,
        removeFromCarCart,
        clearCarCart
      }}
    >
      {children}
    </CarCartContext.Provider>
  );
};
