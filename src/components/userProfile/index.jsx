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

export default function UserProfile({ userData }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleLogout = () => {
    localStorage.clear();
    localStorage.removeItem("platintoken");
    localStorage.removeItem("workstatus");
    localStorage.removeItem("workTimer");
    localStorage.removeItem("lastWorkDuration");
    localStorage.removeItem("timeIntervals");
    window.location.href = "/home";
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
              <ModalHeader className="flex flex-col gap-1 text-white">
                Are you sure you want to logout?
              </ModalHeader>
              <Divider />
              <ModalBody>
                <div className="w-full mt-4 flex justify-between items-center gap-4">
                  <Button color="danger" variant="flat" onPress={handleLogout}>
                    Yes, logout
                  </Button>
                  <Button color="primary" variant="light" onPress={onClose}>
                    No, stay
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
