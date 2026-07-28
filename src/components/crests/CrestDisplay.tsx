import React from 'react';
import Crest1 from './Crest1';
import Crest2 from './Crest2';
import Crest3 from './Crest3';

interface CrestDisplayProps {
  crestId: string;
  className?: string;
}

const CrestDisplay: React.FC<CrestDisplayProps> = ({ crestId, className }) => {
  switch (crestId) {
    case 'crest1.svg':
      return <Crest1 className={className} />;
    case 'crest2.svg':
      return <Crest2 className={className} />;
    case 'crest3.svg':
      return <Crest3 className={className} />;
    default:
      return <Crest1 className={className} />;
  }
};

export default CrestDisplay;
