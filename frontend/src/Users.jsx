import api from './api';
import { Typography, Form, Input, Button, message, Select } from 'antd';

const { Title } = Typography;
const { Option } = Select;

const Users = () => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            await api.post('/users/add', {
                email: values.email,
                role: values.role,
                password: values.password,
            });
            message.success('User added successfully!');
            form.resetFields();
        } catch (err) {
            console.error('Error adding user:', err);
            message.error(err.response?.data?.error || 'Failed to add user. Please try again.');
        }
    };

    return (
        <div className='form-container'>
            <Title level={2}>Add a new User</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please input the email!' },
                        { type: 'email', message: 'The input is not a valid email!' }
                    ]}
                >
                    <Input placeholder="Enter email" />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input the password!' }]}
                >
                    <Input.Password placeholder="Enter password" />
                </Form.Item>
                <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: 'Please select a role!' }]}
                >
                    <Select placeholder="Select a role">
                        <Option value="USER">User</Option>
                        <Option value="SELLER">Seller</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add User
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Users;
