import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function Buttons({ onRangeSelect }) {
  const [selected, setSelected] = useState('1week');

  const handleClick = (range) => {
    setSelected(range);
    onRangeSelect(range); // callback to inform parent/chart
  };

  const buttons = [
    { label: '1 Week', value: '1week' },
    { label: '1 Month', value: '1month' },
    { label: '3 Months', value: '3months' },
    { label: '1 Year', value: '1year' },
  ];

  return (
    <Stack direction="row" spacing={2}>
      {buttons.map(({ label, value }) => (
        <Button
          key={value}
          variant={selected === value ? 'contained' : 'outlined'}
          onClick={() => handleClick(value)}
        >
          {label}
        </Button>
      ))}
    </Stack>
  );
}
