import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";

const UpdateUserRoleModal = ({ isOpen, setIsOpen, role }) => {
  const [updateRole, setUpdateRole] = useState(role);
  console.log(updateRole);

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-xl"
            >
              <DialogTitle
                as="h3"
                className="text-base/7 font-medium text-black"
              >
                Update User Role
              </DialogTitle>
              <form>
                <div>
                  <select
                    value={updateRole}
                    onChange={(e) => setUpdateRole(e.target.value)}
                    name="role"
                    className="w-full border my-3 focus:border-gray-200 border-gray-200 py-3 px-2 rounded-xl"
                  >
                    <option value="admin">Admin</option>
                    <option value="seller">Seller</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>
                <div className="flex justify-between mt-5">
                  <button
                    type="submit"
                    className="bg-green-400 text-gray-700 py-1 rounded-md px-3 cursor-pointer"
                  >
                    Update
                  </button>
                  <button
                    onClick={close}
                    type="button"
                    className="bg-red-400 text-gray-700 py-1 rounded-md px-3 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default UpdateUserRoleModal;
