import { useState, useEffect } from 'react';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';
import { Table, Space, Input, Button, Popconfirm, message, Tag } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import api from '../api';
import { useDebounce } from '../useDebounce';

const AdminUsers = () => {
    const { isAuthenticated, user, logout, isLoading } = useAuth();
    const [messageApi, contextHolder] = message.useMessage()
    const navigate = useNavigate();
    const { Search } = Input;
    const [originalUsers, setOriginalUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearchTerm = useDebounce(searchInput, 300);

    const fetchUsers = async () => {
        try {
            const userRes = await api.get('/users');
            setOriginalUsers(userRes.data);
            setFilteredUsers(userRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated || user?.role !== 'SELLER') {
                navigate('/unauthorized-page', { replace: true });
            } else {
                fetchUsers();
            }
        }
    }, [isAuthenticated, isLoading, user, navigate]);

    useEffect(() => {
        if (debouncedSearchTerm) {
            const filtered = originalUsers.filter(u =>
                u.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(originalUsers);
        }
    }, [debouncedSearchTerm, originalUsers]);

    const assignRole = async (userId, currentRole) => {
        const newRole = currentRole === 'USER' ? 'SELLER' : 'USER';
        try {
            await api.post('/users/assign-role', { userId, role: newRole });
            messageApi.success(`User role changed to ${newRole}`);

            const updatedUsers = originalUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
            setOriginalUsers(updatedUsers);
            setFilteredUsers(updatedUsers.filter(u =>
                u.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            ));

            if (user.id === userId) {
                logout();
            }
        } catch (err) {
            console.error('Failed to change role:', err);
            messageApi.error('Failed to change role');
        }
    };

    const deleteUser = async (id) => {
        try {
            await api.delete(`/users/${id}`);
            messageApi.success('User deleted successfully!');

            if (user && user.id === id) {
                logout();
            }

            const updatedUsers = originalUsers.filter((u) => u.id !== id);
            setOriginalUsers(updatedUsers);
            setFilteredUsers(updatedUsers.filter(u =>
                u.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            ));
        } catch (err) {
            console.error('Error while deleting user:', err);
            messageApi.error('Failed to delete user');
        }
    };

    const columns = [
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color={role === 'SELLER' ? 'red' : 'blue'}>
                    {role.toUpperCase()}
                </Tag>
            ),
            filters: [
                { text: 'SELLER', value: 'SELLER' },
                { text: 'USER', value: 'USER' },
            ],
            onFilter: (value, record) => record.role.includes(value),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => assignRole(record.id, record.role)}>
                        Change Role
                    </Button>
                    <Popconfirm
                        title="Remove User"
                        description={`Are you sure you want to delete the user ${record.email}?`}
                        onConfirm={() => deleteUser(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />}>Delete</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div>
            {contextHolder}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <Search
                    placeholder="Search Here..."
                    onChange={(e) => setSearchInput(e.target.value)}
                    value={searchInput}
                    style={{ width: 300 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/admin/users/add")}>
                    Add New User
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredUsers}
                rowKey="id"
                bordered
            />
        </div>
    );
};

export default AdminUsers;


