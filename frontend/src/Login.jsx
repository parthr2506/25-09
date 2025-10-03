import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import api from "./api";

const Login = () => {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/home", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const onFinish = async (values) => {
        try {
            const res = await api.post("auth/login", values);
            const { token, user } = res.data;
            login(token, user);
            message.success("Login Successful Redirecting...");
        } catch (err) {
            console.error("Login failed:", err);
            message.error(err.response?.data?.error || "Invalid credentials try again");
        }
    };

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="form-container-wrapper">
            <div className="form-container-content">
                <h3>Login</h3>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ remember: true }}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your Email!' },
                            { type: 'email', message: 'The input is not a valid email!' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Enter your email"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Enter your password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Log in
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center', color: 'white' }}>
                        Visiting First Time ?
                        <br />
                        <Link to='/register' style={{ color: '#1890ff' }}>
                            Signup
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Login;
