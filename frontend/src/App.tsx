import React, { useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginModal } from './features/auth/LoginModal';

const App: React.FC = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(true);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
    navigate('/dashboard');
  };

  return (
    <>
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      {}
    </>
  );
};

export default App;