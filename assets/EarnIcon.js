import React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg height={32} width={32} viewBox="0 0 59.998 59.998" {...props}>
      <Path d="M59.457 35.985c-.695-.969-1.55-1.866-3.074-1.866-1.14 0-2.589.506-4.904 1.726l-8.623 5.272c-1.409.75-4.515.9-6.447.93.453-.945.25-2.069-.603-3.343a8.296 8.296 0 00-3.118-2.759A8.904 8.904 0 0036 28.999c0-4.962-4.037-9-9-9s-9 4.038-9 9a8.95 8.95 0 001.027 4.156c-.013-.009-.027-.017-.039-.027C15.423 30.441 9.439 30.045 7 30v-3.029H0v32.028h7v-3h13c2.04 0 4.098-.156 6.116-.462l12.963-1.971a6.77 6.77 0 001.376-.158c1.194-.168 2.335-.738 3.302-1.65l15.181-11.823a2.928 2.928 0 00.519-3.95zM27 23.999c2.757 0 5 2.243 5 5s-2.243 5-5 5-5-2.243-5-5 2.243-5 5-5zm30.686 14.377L42.489 50.21l-.077.067c-.67.641-1.443 1.039-2.334 1.168a4.978 4.978 0 01-1.078.122L25.815 53.56c-1.919.292-3.876.44-5.815.44H7V32c3.646.066 8.239.808 10.784 2.726 1.336 1.008 2.937 1.692 4.645 2.02l.015.009.19.033.029.004c.328.056.66.101.995.13l.032.004c.34.029.682.046 1.027.046h3.9c.55 0 1.1.065 1.634.193l.064.016c1.573.39 2.94 1.315 3.827 2.638.412.615.582 1.13.455 1.377-.189.368-1.155.763-2.841.815-.382-.006-.731-.01-1.04-.01H21c-3.131 0-5 1.495-5 4a1 1 0 102 0c0-.495 0-2 3-2h9.69a11.126 11.126 0 001.036.011l.713.012c.84.016 1.79.033 2.779.033 4.407 0 7.052-.361 8.629-1.202l8.618-5.27c1.901-.999 3.146-1.464 3.918-1.464.49 0 .815.149 1.449 1.032a.916.916 0 01-.146 1.223zM42 18.999c4.963 0 9-4.038 9-9s-4.037-9-9-9-9 4.038-9 9 4.037 9 9 9zm0-14c2.757 0 5 2.243 5 5s-2.243 5-5 5-5-2.243-5-5 2.243-5 5-5z" />
    </Svg>
  );
}

export default SvgComponent;
