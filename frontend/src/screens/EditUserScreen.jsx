import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditUserScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/users/${id}`);
        const data = await res.json();
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
      } catch (err) {
        toast.error('Failed to load user');
      }
    };

    fetchUser();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/users/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, isAdmin }),
      });

      if (!res.ok) throw new Error('Update failed');

      toast.success('User updated successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Error updating user');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Edit User</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name' className='mb-3'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='email' className='mb-3'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Button type='submit' variant='primary'>
          Update
        </Button>
      </Form>
    </div>
  );
};

export default EditUserScreen;
