import React from 'react';
import ReactDOM from 'react-dom';

import MainView from './views/mainView'
//var mainView = require('./views/mainView')
/*class mainView extends React.Component {
  render() {
    console.log("test");
    return <h2>Test234</h2>
  }
}*/

//console.log(MainView.class, "test");

ReactDOM.render(
  <MainView/>,
  document.getElementById('app')
);

module.hot.accept();
