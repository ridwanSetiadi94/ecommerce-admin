"use client";

import { StoreModal } from "@/components/modals/store.modal";
import { useEffect, useState } from "react";

export function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // to avoid hydration mismatch, we only render the modal provider after the component has mounted
  // this ensures that the modal components are only rendered on the client side
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <StoreModal />
    </>
  );
}
