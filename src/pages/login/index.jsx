import { Form, Input, Button } from "@heroui/react";
import { useState } from "react";
import { useLogin } from "../../config/apiHooks/useAdmin";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LoginBackgroundBeamsWithCollision } from "../../components/LoginBackgroundBeamsWithCollision/LoginBackgroundBeamsWithCollision";
import logo from "../../assets/platin.png";
export default function Login() {
  const [userDatas, setUserDatas] = useState({ username: "", password: "" });
  const [userErrors, setUserErrors] = useState({
    username: false,
    passwoard: false,
  });
  const [loginLoader, setLoginLoader] = useState(false);
  const { mutate: login } = useLogin();
  const navigate = useNavigate();

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

    setLoginLoader(true);
    login(userDatas, {
      onSuccess: (data) => {
        if (data.status === 200) {
          localStorage.setItem("platintoken", data.token);
          toast.success("Login successful");

          navigate("/home");
        }
        setLoginLoader(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Login failed");
        setLoginLoader(false);
      },
    });
  };

  return (
    <>
      <LoginBackgroundBeamsWithCollision />
      <div className="flex justify-center items-center  z-50 fixed top-40 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <img src={logo} alt="logo"  />
      </div>
      <div className="bg-gradient-to-b from-[#0a0a0a78] to-[#2626267b]    w-[90%]  md:w-full rounded-3xl p-4 shadow-xl border border-[rgba(238,73,73,0.46)]  flex flex-col justify-between max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h2 className="text-white text-[32px] md:text-[36px] font-bold mb-7 text-center">
          Welcome Back
        </h2>

        <Form className="flex flex-col gap-5" onSubmit={submitHandler}>
          <div className="w-full">
            <Input
              labelPlacement="outside"
              name="username"
              placeholder="username"
              classNames={{ inputWrapper: "bg-zinc-200" }}
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
              labelPlacement="outside"
              name="password"
              placeholder="password"
              classNames={{ inputWrapper: "bg-zinc-200" }}
              onChange={changeHandler}
            />
            {userErrors.passwoard && (
              <span className="text-red-500 text-xs">
                please enter passwoard
              </span>
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button
              className="bg-green-500 text-white px-10 py-3"
              type="submit"
              isLoading={loginLoader}
            >
              submit
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}
