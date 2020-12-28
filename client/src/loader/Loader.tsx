import React from 'react';
import './loader.css';

interface LoaderProps {}

const Loader: React.FC<LoaderProps> = () => {
  return (
    <div className="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loader;
