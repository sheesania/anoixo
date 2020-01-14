import React, {useState} from 'react';

const App: React.FC = () => {
  const [text, setText] = useState('')

  const getText = () => {
    fetch('http://localhost:5000/text/nlf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reference: 'Matt.5.1',
        sequences: [],
      }),
    })
    .then(response => response.json())
    .then((json) => {
      setText(json.text)
    })
  }

  return (
    <div className='App'>
      <input type='button' value='Get text' onClick={getText}></input>
      <div id='text'>{text}</div>
    </div>
  );
}

export default App;
