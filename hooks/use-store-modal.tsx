import { create } from "zustand";

interface useStoreModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

// To understand the code better, I break it down into named functions:
// Named function to handle opening the modal
function handleOpen(
  set: (state: Partial<useStoreModalStore>) => void
): () => void {
  function openModal() {
    set({ isOpen: true });
  }

  return openModal;
}

// Named function to handle closing the modal
function handleClose(
  set: (state: Partial<useStoreModalStore>) => void
): () => void {
  function closeModal() {
    set({ isOpen: false });
  }

  return closeModal;
}

// Named store initializer function
function initializeStoreModal(
  set: (state: Partial<useStoreModalStore>) => void
): useStoreModalStore {
  return {
    isOpen: false,
    onOpen: handleOpen(set),
    onClose: handleClose(set),
  };
}

// Zustand store creation using a named function
export const useStoreModal = create<useStoreModalStore>(initializeStoreModal);
// End of the detail version

// // Uncomment the following lines to use the compact version:
// // Compact version of the store creation using arrow functions
// export const useStoreModal = create<useStoreModalStore>((set) => ({
//   isOpen: false,
//   onOpen: () => set({ isOpen: true }),
//   onClose: () => set({ isOpen: false }),
// }));
// // End of the compact version
