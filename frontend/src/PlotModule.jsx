import React from 'react';
import Plot from 'react-plotly.js';

const PlotModule = () =>  {
  const [x, setX] = useState([]);
  const [y, setY] = useState([]);

  render() {
    return (
      <Plot
        data={[
          {
            x: x,
            y: y,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
          {type: 'bar', x: x, y: y},
        ]}
        layout={ {width: 320, height: 240, title: {text: 'A Fancy Plot'}} }
      />
    );
  }
}

export default PlotModule;