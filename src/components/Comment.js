import React, { Text } from 'react';

export default (Comment = (props) => (
  <Text>
    {props.message}
  </Text>
));