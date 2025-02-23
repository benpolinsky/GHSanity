import React from 'react';
import styles from './NotificationList.module.css';

interface Label {
  id: number;
  name: string;
  color: string; 
  description: string;
  url: string;
}

interface LabelsProps {
  labels: Label[];
}

const Labels: React.FC<LabelsProps> = ({ labels }) => {
  return (
    labels.length > 0 &&
    <div className={styles.labels}>
      {labels.map(label => 
        {console.log(label.color)
          return <span key={label.id} style={{backgroundColor: `#${label.color}`, color: oppositeColor(label.color)}} className={styles.label}>{label.name}</span>}
      )}
    </div>
  );
};

export default Labels;

function oppositeColor(color: string){
  if (color.length !== 6){
    return 'black';
  }

  const r = parseInt(color.slice(0,2), 16);
  const g = parseInt(color.slice(2,4), 16);
  const b = parseInt(color.slice(4,6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? 'black' : 'white';
}