import { Container, Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux';


const Hero = () => {

  const { userInfo } = useSelector((state) => state.auth);
  return (
    <div className=' py-5'>
      <Container className='d-flex justify-content-center'>
        <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>
          <h1 className='text-center mb-4'>Hi '{ userInfo.name }' Welcome to Home page</h1>
          <p className='text-center mb-4'>
            Hi, if you want to check your profile <br /> Click here
          </p>
          <div className='d-flex'>
            <LinkContainer to='/profile'>
              <Button variant='primary' className='me-3'>
              Profile
              </Button>
            </LinkContainer>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Hero;