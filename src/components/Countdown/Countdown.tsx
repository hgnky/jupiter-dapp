import React, {useState} from 'react';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import "./style.scss";

interface ProgressCountdownProps {
  deadline: Date;
}

const ProgressCountdown: React.FC<ProgressCountdownProps> = ({ deadline }) => {

  const Completionist = () => <p>Rebasing</p>

  const countdownRenderer = (countdownProps: CountdownRenderProps) => {
    const { days, hours, minutes, seconds, completed } = countdownProps;
    const h = String(days * 24 + hours);
    const m = String(minutes);
    const s = String(seconds);
    if (completed) {
      return <Completionist />;
    } else {
      return (
        <p className='styled-countdown'>
          {h.padStart(2, '0')}:{m.padStart(2, '0')}:{s.padStart(2, '0')}
        </p>
      );
    }
  };
  return (
    // <Card>
    <div className='styled-cardcontent'>
      <Countdown key={new Date().getTime()} date={deadline} renderer={countdownRenderer}/>
    </div>
    // </Card>
  );
};

// const StyledCountdown = styled.p`
//   // font-size: 14px;
//   font-weight: 700;
//   // color: ${(props) => props.theme.color.grey[100]};
//   margin: 0 0 6px 0;
// `;

// const StyledProgressOuter = styled.div`
//   width: 100%;
//   height: 8px;
//   border-radius: 3px;
//   background: ${(props) => props.theme.color.grey[700]};
// `;

// const StyledProgress = styled.div<{ progress: number }>`
//   width: ${(props) => props.progress}%;
//   height: 100%;
//   border-radius: 3px;
//   background: ${(props) => props.theme.color.grey[100]};
// `;

// const StyledCardContentInner = styled.div`
//   height: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-direction: column;
//   // padding: ${(props) => props.theme.spacing[2]}px ${(props) => props.theme.spacing[4]}px;
// `;

export default ProgressCountdown;
