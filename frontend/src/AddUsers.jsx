import api from './api';
import { useState } from 'react';
import { Form, Input, Button, message, Select } from 'antd';
const { Option } = Select;
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const AddUsers = () => {
    const [form] = Form.useForm();
    const [openAlert, setOpenAlert] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values) => {
        try {
            await api.post('/users/add', {
                email: values.email,
                role: values.role,
                password: values.password,
            });
            messageApi.success('User added successfully');
            setOpenAlert(true);
            form.resetFields();
        } catch (err) {
            console.error('Error adding user:', err);
            messageApi.error(err.response?.data?.error || 'Failed to add user try again.');
        }
        finally {
            setTimeout(() => setOpenAlert(false), 3000);
        }
    };
    const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    return (
        <div className="form-container-wrapper">
            <div className="form-container-content">
                <h2>Add a new User</h2>
                {contextHolder}
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

                <Snackbar
                    open={openAlert}
                    autoHideDuration={2000}
                    onClose={handleCloseAlert}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <MuiAlert onClose={handleCloseAlert} elevation={6} variant="filled" severity="success">
                        New User Added Successfully
                    </MuiAlert>
                </Snackbar>
            </div>
        </div>
    );
};

export default AddUsers;
