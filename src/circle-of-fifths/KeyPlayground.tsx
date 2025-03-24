import KeyChooser from './KeyChooser.tsx';

const KeyPlayground = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
      <KeyChooser label="Tonacja w śpiewniku" helperText="W jakiej tonacji wpisałeś akordy" required />
      <KeyChooser label="Tonacja oryginalna" />
    </div>
  );
};

export default KeyPlayground;
