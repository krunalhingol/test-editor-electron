import React from 'react';

const gridComponent = (props) => {
  const { id } = props;
  return <div id={id} className='tree-grid'/>;
};

export default gridComponent;
