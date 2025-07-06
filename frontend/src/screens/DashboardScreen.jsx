import React, { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';


const DashboardScreen = () => {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchUsers();
    } else {
      navigate('/login');
    }
  }, [userInfo, keyword]);

  const fetchUsers = async () => {
    const response = await fetch(`/api/users/users?keyword=${keyword}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    const data = await response.json();
    setUsers(data);
  };

  const deleteUserHandler = (id) => {
  confirmAlert({
    title: 'Confirm Deletion',
    message: 'Are you sure you want to delete this user?',
    buttons: [
      {
        label: 'Yes',
        onClick: async () => {
          try {
            await fetch(`/api/users/users/${id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${userInfo.token}`,
              },
            });
            toast.success('User deleted');
            fetchUsers();
          } catch (err) {
            toast.error('Failed to delete user');
          }
        },
      },
      {
        label: 'No',
      },
    ],
  });
};


  return (
    <div>
      <h2>Admin Dashboard - Manage Users</h2>

      <Form className="mb-3" onSubmit={(e) => e.preventDefault()}>
        <Form.Control
          type="text"
          placeholder="Search by name..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </Form>
    <Button
        className="mb-3"
        variant="primary"
        onClick={() => navigate('/create-user')}
      >
        Create New User
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
          .filter((u) => !u.isAdmin)
          .map((u) => (
            <tr key={u._id}>
              <td>{u._id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteUserHandler(u._id)}
                >
                  Delete
                </Button>
                <Button
                  variant="info"
                  size="sm"
                  className="ms-2"
                  onClick={() => navigate(`/edit-user/${u._id}`)}
                >
                  Edit
                </Button>

              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DashboardScreen;
