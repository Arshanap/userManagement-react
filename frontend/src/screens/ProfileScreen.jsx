import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { setCredentials } from '../slices/authSlice.js';
import { toast } from 'react-toastify';
import Loader from '../components/Loader.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateUserMutation } from '../slices/usersApiSlice.js';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showForm, setShowForm] = useState(false);

  const dispatch = useDispatch();

  const [updateProfile, { isLoading }] = useUpdateUserMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await updateProfile({
        _id: userInfo._id,
        name,
        email,
        ...(password && { password }) 
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      toast.success('Profile Updated');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <div className="text-center border p-4 rounded shadow-sm" style={{ width: '500px', margin: '30px' }}>
            <h5>Profile Info</h5>
            <p><strong>Name:</strong> {userInfo?.name}</p>
            <p><strong>Email:</strong> {userInfo?.email}</p>
            <Button
            onClick={() => setShowForm(!showForm)}
            variant='secondary'
            className='mb-3'
            >
                {showForm ? 'Hide' : 'Show edit'}
            </Button>
        </div>
      </div>


      {showForm && (
        <FormContainer>
          <h1>Edit Profile</h1>

          <Form onSubmit={submitHandler}>
            <Form.Group className='my-2' controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className='my-2' controlId='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className='my-2' controlId='password'>
              <Form.Label>New Password (Optional)</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter new password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className='my-2' controlId='confirmPassword'>
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm new password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            {isLoading && <Loader />}

            <Button type='submit' variant='primary' className='mt-3'>
              Update
            </Button>
          </Form>
        </FormContainer>
      )}
    </>
  );
};

export default ProfileScreen;
