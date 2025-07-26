import { Card, CardHeader, CardContent } from '@mui/material';
import '../styles/InfoBox.css';

export default function InfoBox({ title, children, className = '' }) {
  return (
    <Card className={`info-box ${className}`}>
      <CardHeader title={title} />
      <CardContent className="info-content">
        {children}
      </CardContent>
    </Card>
  );
}
