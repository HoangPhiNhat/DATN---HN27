/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import useAutoFocus from "../../hooks/customHook/useAutoFocus";
import { signIn } from "../../services/auth";

const SignIn = () => {
  const inputRef = useAutoFocus(open);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const { mutate, isPending } = useMutation({
    mutationFn: async (user) => {
      const res = await signIn(user);

      if (res.user.role == "user") {
        throw Error("Bạn không có quyền đăng nhập. Vui lòng liên hệ admin");
      }

      return res;
    },
    onError: (error) => {
      if (error.response && error.response.data) {
        messageApi.error(error.response.data.message);
      } else if (error instanceof Error) {
        messageApi.error(error.message);
      } else {
        messageApi.error("Đã xảy ra lỗi không xác định.");
      }
    },
    onSuccess: (data) => {
      messageApi.success("Đăng nhập thành công.");
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("access", data.access_token);
      localStorage.setItem("refresh", data.refresh_token);
      navigate("/admin");
    },
  });
  const onFinish = async (values) => {
    mutate(values);
  };

  const onFinishFailed = (errorInfo) => {
    messageApi.error("SignIn fail");
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {contextHolder}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="p-8 bg-white rounded-lg shadow-lg w-full max-w-[400px]"
        >
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your Email!" },
              { type: "email", message: "The input is not valid E-mail!" },
            ]}
          >
            <Input placeholder="Email" ref={inputRef} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              loading={isPending}
              type="primary"
              htmlType="submit"
              className="w-full"
            >
              Log in
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            <a
              href="/forgot-password"
              className="text-blue-500 hover:underline"
            >
              Forgot your password?
            </a>
          </div>

          <div className="text-center mt-4">
            <span className="mx-1">Don't have an account?</span>
            <Link to="/signup" className="text-blue-500 hover:underline">
              Register now!
            </Link>
          </div>
        </Form>
      </div>
    </>
  );
};

export default SignIn;
