import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Divider } from "@heroui/react";
import { Form, Input, Button } from "@heroui/react";
import "./style.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { CardStack, Highlight } from "../../components/card";
import Timer from "../../components/Timer/Timer";
import useGeoLocation from "../../hook/geoLocation";
import StartEndWorkButton from "../../components/StartEndWorkButton/StartEndWorkButton";
import {
  useProfile,
  useCheckIn,
  useCheckOut,
  useLogin,
  useEmployeeStatus,
} from "../../config/apiHooks/useAdmin";
import Layout from "../../layout";
import { div } from "framer-motion/client";

function Home() {
  const [token, setToken] = useState(localStorage.getItem("platintoken"));
  const { location, error } = useGeoLocation();
  console.log(location, error);
  const [checkIn, setCheckIn] = useState(false);
  const [buttonActive, setButtonActive] = useState(
    localStorage.getItem("workstatus") === "IN"
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [confirmEndModal, setConfirmEndModal] = useState(false);
  const now = new Date();

  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    numberingSystem: "latn",
  };
  const persianDate = new Intl.DateTimeFormat("fa-IR", options).format(now);

  const [userDatas, setUserDatas] = useState({
    username: "",
    password: "",
  });
  const [userErrors, setUserErrors] = useState({
    username: false,
    passwoard: false,
  });

  // React Query hooks
  const {
    data: userProfile,
    isLoading: profileLoading,
    error: profileError,
  } = useProfile();
  const { mutateAsync: mutateCheckIn } = useCheckIn();
  const { mutateAsync: mutateCheckOut } = useCheckOut();
  const { mutate: loginMutation, isPending: loginLoading } = useLogin();
  const {
    data: employeeStatus,
    refetch: refetchEmployeeStatus,
    isLoading: statusLoading,
  } = useEmployeeStatus();

  useEffect(() => {
    setToken(localStorage.getItem("platintoken"));
    const workStatus = localStorage.getItem("workstatus");
    if (workStatus === "IN") {
      setCheckIn(true);
      setButtonActive(true);
    }
  }, []);
  // Replace buttonActive and checkIn state with API status
  const checkedIn = employeeStatus?.checked_in;
  const checkedOut = employeeStatus?.checked_out;

  const checkInTime = employeeStatus?.check_in_time;
  const checkOutTime = employeeStatus?.check_out_time;

  // In handleSlideComplete, refetch status after check-in/out
  const handleSlideComplete = async () => {
    if (!localStorage.getItem("platintoken")) {
      onOpen();
      return;
    }
    if (!checkedIn) {
      await handleCheckIn();
    } else {
      setConfirmEndModal(true);
    }
    refetchEmployeeStatus();
  };

  // In handleCheckIn and handleCheckOut, refetch status after action
  const handleCheckIn = async () => {
    try {
      const data = await mutateCheckIn();
      if (data?.status === 200) {
        toast.success("Your task has started successfully");
      } else {
        toast.error(data?.message || "خطا در شروع کار");
      }
      refetchEmployeeStatus();
    } catch (err) {
      console.log(err);
      toast.error("An issue has occurred");
    }
  };
  const handleCheckOut = async () => {
    try {
      const data = await mutateCheckOut();
      if (data?.status === 200) {
        toast.success("Your task was completed successfully");
        setConfirmEndModal(false);
      } else {
        toast.error(data?.message || "خطا در پایان کار");
      }
      refetchEmployeeStatus();
    } catch (err) {
      console.error("Check-out failed:", err);
      toast.error("Error completing the task");
    }
  };

  const changeHandler = (e) => {
    setUserDatas({
      ...userDatas,
      [e.target.name]: e.target.value,
    });
    setUserErrors({
      ...userErrors,
      [e.target.name]: false,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const errors = {
      username: userDatas.username.trim() === "",
      passwoard: userDatas.password.trim() === "",
    };

    setUserErrors(errors);
    const hasError = Object.values(errors).some((err) => err);
    if (hasError) return;

    loginMutation(userDatas, {
      onSuccess: (data) => {
        if (data.status === 200) {
          localStorage.setItem("platintoken", data.token);
          setToken(data.token);
          toast.success("Login successful");
          onOpenChange();
          window.location.reload();
        }
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Login failed");
      },
    });
  };

  const CARDS = [
    {
      id: 0,
      name: "Platin",
      designation: "Total days",

      content: (
        <p>
          This user has been active from {userProfile?.contract_start} to{" "}
          {persianDate} for a total of{" "}
          <Highlight>{userProfile?.worked_days} days</Highlight>.
        </p>
      ),
    },
    {
      id: 1,
      name: "Platin",
      designation: "Total hours",
      content: (
        <p>
          This user has been active from {userProfile?.contract_start} to{" "}
          {persianDate} for a total of{" "}
          <Highlight>{userProfile?.worked_time} hours</Highlight>.
        </p>
      ),
    },
  ];

  return (
    <Layout>
      <div className="container m-auto w-full  ">
        <div className="w-full  flex-col items-center justify-start">
          {userProfile && !profileLoading && (
            <div>
              <CardStack items={CARDS} />
            </div>
          )}

          {profileLoading && (
            <div className="text-center py-8">
              <p className="text-white">Loading profile...</p>
            </div>
          )}

          {profileError && (
            <div className="text-center py-8">
              <p className="text-[#ee4949]">Error loading profile</p>
            </div>
          )}

          {token && (checkedIn || checkedOut) && (
            <div className="mb-12 m-auto relative  w-[90%]  md:w-[90%]">
              <div className=" bg-gradient-to-b from-[#262626] to-[#0a0a0a]    w-full md:h-60 md:w-full rounded-3xl p-4 shadow-xl border border-[rgba(238,73,73,0.68)] flex flex-col justify-between ">
                <h2 className="text-2xl font-bold text-[#ee4949] mb-6 text-center tracking-wide">
                  Attendance Info
                </h2>

                {checkedIn && (
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-300 font-medium">
                      Check-in Time:
                    </span>
                    <span className="text-green-400 font-semibold">
                      {checkInTime}
                    </span>
                  </div>
                )}

                {checkedOut && (
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-300 font-medium">
                      Check-out Time:
                    </span>
                    <span className="text-red-400 font-semibold">
                      {checkOutTime}
                    </span>
                  </div>
                )}

                {checkedIn && checkedOut && (
                  <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
                    <span className="text-white font-semibold">
                      Total Worked:
                    </span>
                    <span className="text-[#ee4949] font-bold tracking-wider">
                      {(() => {
                        const inTime = new Date(`1970-01-01T${checkInTime}`);
                        const outTime = new Date(`1970-01-01T${checkOutTime}`);
                        const diffMs = outTime - inTime;
                        const hours = Math.floor(diffMs / (1000 * 60 * 60));
                        const minutes = Math.floor(
                          (diffMs % (1000 * 60 * 60)) / (1000 * 60)
                        );
                        return `${hours}h ${minutes}m`;
                      })()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <StartEndWorkButton
            token={token}
            buttonActive={checkedIn}
            onOpen={onOpen}
            handleSlideComplete={handleSlideComplete}
            statusLoading={statusLoading}
            checkedIn={checkedIn}
            checkedOut={checkedOut}
          />
        </div>
        <Modal
          classNames={{ backdrop: "z-[99999]", wrapper: "z-[99999]" }}
          className="flex justify-center items-center"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          <ModalContent className="py-4 bg-gradient-to-b from-[#262626] to-[#0a0a0a]">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col jus gap-1 text-white">
                  Please log in first, then start the task.{" "}
                </ModalHeader>
                <Divider />
                <ModalBody
                  style={{
                    // overflowY: "auto",
                    maxHeight: "500px",
                    fontSize: 16,
                  }}
                >
                  <Form
                    className="w-full max-w-xs flex flex-col justify-center gap-4"
                    // validationErrors={errors}
                    onSubmit={submitHandler}
                  >
                    <div className="w-full">
                      <Input
                        // label="Username"
                        labelPlacement="outside"
                        name="username"
                        placeholder="username"
                        className="p-2 w-full rounded !outline-none"
                        classNames={{
                          inputWrapper: "bg-zinc-200",
                        }}
                        onChange={changeHandler}
                      />
                      {userErrors.username && (
                        <span className="text-red-500 text-xs">
                          please enter user name
                        </span>
                      )}
                    </div>

                    <div className="w-full">
                      <Input
                        // label="Username"
                        labelPlacement="outside"
                        name="password"
                        placeholder="password"
                        className="p-2 w-full rounded !outline-none"
                        onChange={changeHandler}
                        classNames={{
                          inputWrapper: "bg-zinc-200",
                        }}
                      />
                      {userErrors.passwoard && (
                        <span className="text-red-500 text-xs">
                          please enter passwoard
                        </span>
                      )}
                    </div>

                    <div className="w-full mt-4 flex justify-between items-center gap-4">
                      <Button
                        className=" bg-green-500 text-white px-10 py-3"
                        type="submit"
                        variant="flat"
                        isLoading={loginLoading}
                      >
                        submit
                      </Button>
                      <Button
                        className=" bg-red-500 text-white px-10 py-3"
                        color="danger"
                        variant="light"
                        onPress={onClose}
                      >
                        close
                      </Button>
                    </div>
                  </Form>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Confirmation Modal for Ending Work */}
        <Modal
          classNames={{ backdrop: "z-[99999]", wrapper: "z-[99999]" }}
          className="flex justify-center items-center"
          isOpen={confirmEndModal}
          onOpenChange={() => setConfirmEndModal(false)}
        >
          <ModalContent className="py-4 bg-gradient-to-b from-[#262626] to-[#0a0a0a]">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col text-white">
                  Are you sure you want to complete the task?{" "}
                </ModalHeader>
                <Divider />
                <ModalBody
                  style={{
                    fontSize: 16,
                  }}
                >
                  <div className="w-full mt-4 flex justify-between items-center ">
                    <Button
                      className=" bg-green-500 text-white px-10 py-3 "
                      onPress={handleCheckOut}
                      variant="flat"
                    >
                      Yes, finished.{" "}
                    </Button>
                    <Button
                      className=" bg-red-500 text-white px-5 py-3 ml-1"
                      color="danger"
                      variant="light"
                      onPress={onClose}
                    >
                      No, continue working.{" "}
                    </Button>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </Layout>
  );
}

export default Home;
