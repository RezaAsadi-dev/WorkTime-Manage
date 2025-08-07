import { User } from "@heroui/react";
import { Button } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/modal";
import { Divider } from "@heroui/react";
import { useLogout } from "../../config/apiHooks/useAdmin";
import { useNavigate } from "react-router-dom";

export default function UserProfile({ userData }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { mutate: logout, isPending: logoutLoading } = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <User
        avatarProps={{
          src: "https://avatars.githubusercontent.com/u/30373425?v=4",
        }}
        description={userData?.expertise}
        name={userData?.name}
      />
      <Button color="danger" variant="flat" onPress={onOpen}>
        Logout
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{ backdrop: "z-[99999]", wrapper: "z-[99999]" }}
      >
        <ModalContent className="py-4 bg-gradient-to-b from-[#262626] to-[#0a0a0a]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col text-white">
                Are you sure you want to logout?
              </ModalHeader>
              <Divider />
              <ModalBody>
                <div className="w-full mt-4 flex justify-between items-center">
                  <Button
                    className="bg-red-500 text-white px-10 py-3"
                    onPress={handleLogout}
                    variant="flat"
                    isLoading={logoutLoading}
                  >
                    Yes, logout
                  </Button>
                  <Button
                    className="bg-gray-500 text-white px-5 py-3"
                    color="default"
                    variant="light"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
