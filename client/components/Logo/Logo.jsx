import React, { useState } from 'react';
import Image from 'react-bootstrap/Image';
import Link from 'next/link';

const Logo = () => {
  // const [image, setImage] = useState(0);

  // setTimeout(() => {
  //   setImage(image === 0 ? 1 : 0);
  // }, 500);

  return (
    <Link href='/'>
      <Image src={`/images/logo/doodle.gif`} />
    </Link>
  );
};

export default Logo;
