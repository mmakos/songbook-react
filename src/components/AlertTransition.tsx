import { forwardRef, ReactElement, Ref } from 'react';
import { Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement;
    },
    ref: Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} />
);

export default Transition;
