import { component } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { styled } from '@dark-engine/styled';

type IconProps = {
  size: number;
};

const PeaceIcon = component<IconProps>(({ size }) => {
  return (
    <svg
      stroke='currentColor'
      fill='currentColor'
      stroke-width='0'
      viewBox='0 0 16 16'
      height={`${size}px`}
      width={`${size}px`}
      xmlns='http://www.w3.org/2000/svg'>
      <path d='M7.5 1.018a7 7 0 0 0-4.79 11.566L7.5 7.793V1.018zm1 0v6.775l4.79 4.79A7 7 0 0 0 8.5 1.018zm4.084 12.273L8.5 9.207v5.775a6.97 6.97 0 0 0 4.084-1.691zM7.5 14.982V9.207l-4.084 4.084A6.97 6.97 0 0 0 7.5 14.982zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z' />
    </svg>
  );
});

const App = component(() => {
  return (
    <Container>
      <PeaceIcon size={256} />
    </Container>
  );
});

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  color: #e91e63;
`;

createRoot(document.getElementById('root')).render(<App />);
