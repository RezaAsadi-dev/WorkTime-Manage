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
import axios from "axios";
import { toast } from "react-toastify";
import { CardStack, Highlight } from "../../components/card";
import { fetchUserProfile } from "../../hook/hook";

const BASE_URL = import.meta.env.VITE_MAIN_ADDRESS;
const userLogin = "user/api/login";
const checkInEndpoint = "user/api/check-in";
const checkOutEndpoint = "user/api/check-out";

function Home() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [checkIn, setCheckIn] = useState(false);
  const [shouldReset, setShouldReset] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [confirmEndModal, setConfirmEndModal] = useState(false);

  const now = new Date();

  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    calendar: "persian",
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

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const handleSlideComplete = async () => {
    if (!localStorage.getItem("token")) {
      onOpen();
      return;
    }

    if (!checkIn) {
      await handleCheckIn();
    } else {
      setConfirmEndModal(true);
    }
  };

  const handleCheckIn = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/${checkInEndpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
        setCheckIn(true);
        toast.success("کار شما با موفقیت شروع شد");
      } else {
        setCheckIn(false);
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("مشکلی وجود دارد");
      console.log(err);
    }
  };

  const handleCheckOut = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/${checkOutEndpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
        setCheckIn(false);
        setShouldReset(true);
        toast.success("کار شما با موفقیت به اتمام رسید");
        setConfirmEndModal(false);
        setTimeout(() => setShouldReset(false), 100);
      }
    } catch (err) {
      console.error("Check-out failed:", err);
      toast.error("خطا در اتمام کار");
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

    try {
      const response = await axios.post(`${BASE_URL}/${userLogin}`, userDatas, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === 200) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        toast.success("با موفقیت وارد شدید");
        fetchUserProfile()
        onOpenChange();
      }
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("ورود با خطا مواجه شد");
    }
  };

  useEffect(() => {
    fetchUserProfile().then((data) => {
      setUserProfile(data);
    });
  }, [token]);

  const CARDS = [
    {
      id: 0,
      name: "Platin",
      designation: "Total days",

      content: (
        <p>
          این کاربر از تاریخ {userProfile?.contract_start} تا {persianDate} به
          مدت <Highlight> {userProfile?.worked_days} روز </Highlight> فعال بوده
          است
        </p>
      ),
    },
    {
      id: 1,
      name: "Platin",
      designation: "Total hours",
      content: (
        <p>
          این کاربر از تاریخ {userProfile?.contract_start} تا {persianDate} به
          مدت
          <Highlight> {userProfile?.worked_time} ساعت</Highlight> فعال بوده است
        </p>
      ),
    },
  ];

  return (
    <>
      <div className="container m-auto w-full  ">
        <div className="w-full  flex-col items-center justify-start">
          {userProfile && (
            <div>
              <CardStack items={CARDS} />
            </div>
          )}
          <div className=" flex justify-center align-middle">
            <button
              onClick={() => {
                if (!localStorage.getItem("token")) {
                  onOpen();
                } else {
                  setButtonActive(!buttonActive);
                  handleSlideComplete();
                }
              }}
              className={`group duration-500 before:duration-500 after:duration-500 underline underline-offset-2 relative ${
                buttonActive
                  ? " bg-[rgb(238,73,73)] underline underline-offset-4 decoration-2 text-white after:-right-2 before:top-8 before:right-16 after:scale-150 after:blur-none before:-bottom-8 before:blur-none before:bg-black after:bg-[#262626]"
                  : "bg-gradient-to-b from-[#262626] to-[#0a0a0a] text-gray-50 after:right-8 after:top-3 before:right-1 before:top-1 before:blur-lg after:blur before:bg-red-700 after:bg-[rgb(238,73,73)]"
              } h-16 w-[90%] border text-left p-3 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:z-10 before:rounded-full after:absolute after:z-10 after:w-20 after:h-20 after:content[''] after:rounded-full`}
            >
              {buttonActive ? "End Work" : "Start Work"}
            </button>
          </div>
        </div>
        <Modal
          classNames={{ backdrop: "z-[99999]", wrapper: "z-[99999]" }}
          className="flex justify-center items-center"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          <ModalContent className="py-4">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col jus gap-1">
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
                      />
                      {userErrors.passwoard && (
                        <span className="text-red-500 text-xs">
                          please enter passwoard
                        </span>
                      )}
                    </div>

                    <div className="w-full mt-4 flex justify-between items-center gap-4">
                      <Button
                        className="border bg-green-500 text-white px-10 py-3"
                        type="submit"
                        variant="flat"
                      >
                        submit
                      </Button>
                      <Button
                        className="border bg-red-500 text-white px-10 py-3"
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
          <ModalContent className="py-4">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col jus gap-1">
                  Are you sure you want to complete the task?{" "}
                </ModalHeader>
                <Divider />
                <ModalBody
                  style={{
                    maxHeight: "200px",
                    fontSize: 16,
                  }}
                >
                  <div className="w-full mt-4 flex justify-between items-center gap-4">
                    <Button
                      className="border bg-green-500 text-white px-10 py-3"
                      onClick={handleCheckOut}
                      variant="flat"
                    >
                      Yes, finished.{" "}
                    </Button>
                    <Button
                      className="border bg-red-500 text-white px-10 py-3"
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
    </>
  );
}

export default Home;
