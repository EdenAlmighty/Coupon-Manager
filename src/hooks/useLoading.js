import { useContext } from "react";
import { LoadingContext } from "../context/LoadingContext";

export function useLoading() {
    return useContext(LoadingContext);
  }