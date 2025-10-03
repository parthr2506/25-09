import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./useAuth";
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import api from "./api";

const Register = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [form] = Form.useForm();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/home", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const onFinish = async (values) => {
        try {
            await api.post('auth/register', values);
            message.success("Signup successful! Redirecting to login...");
            form.resetFields();
            navigate("/login");
        } catch (error) {
            console.error('Error:', error);
            message.error(error.response?.data?.error || "Signup failed. Please try again.");
        }
    };

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="form-container-wrapper">
            <div className="form-container-content">
                <h3>Sign Up</h3>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
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
                        rules={[
                            { required: true, message: 'Please input your Password!' },
                            { min: 6, message: 'Password must be at least 6 characters long!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Enter your password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" >
                            Sign Up
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center', color: 'white' }}>
                        Already Signed In?
                        <br />
                        <Link to='/login'>
                            Login
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Register;
