import Image from 'next/image';

const Logo = () => {
  return (
    <Image
      src={'/logo-no-bg.png'}
      height={45}
      width={150}
      alt="User Caring"
    />
  );
};

export default Logo;
