import api from './api';
import { Form, Input, InputNumber, Button, message } from 'antd';

const AdminDashboard = () => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            await api.post('/products', {
                name: values.name,
                description: values.description,
                price: Number(values.price),
                stock: Number(values.stock),
                images: [],
            });
            message.success('Product added successfully');
            form.resetFields();
        } catch (err) {
            console.error('Error adding product:', err);
            message.error(err.response?.data?.error || 'Failed to add product try again.');
        }
    };

    return (
        <div className='form-container-wrapper'>
            <div className='form-container-content'>
                <h3>Add a new Product to Stock</h3>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Product Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter the product name!' }]}
                    >
                        <Input placeholder="Enter product name" />
                    </Form.Item>
                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please enter the price!' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter price" />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please enter the product description' }]}
                    >
                        <Input.TextArea placeholder="Enter product description" />
                    </Form.Item>
                    <Form.Item
                        label="Stock"
                        name="stock"
                        rules={[{ required: true, message: 'Please enter the stock quantity!' }]}
                    >
                        <InputNumber style={{ width: "100%" }} placeholder="Enter quantity" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div >
    );
};

export default AdminDashboard;
