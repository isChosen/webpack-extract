import React, { Component } from 'react';
import Toast from './commons/Toast';
import _ from 'lodash/array';
import Axios from 'axios';
import { DatePicker } from 'antd';

import 'antd/dist/antd.css';

import d2 from '../images/d2.jpg';
import homeStyle  from '../less/home.less';

class Home extends Component {

  componentDidMount() {
    console.log('lodash/array -> ', _);
  }

  render() {
    return (
      <div className={homeStyle['home']}>
        <div className={homeStyle['title']}>Home</div>
        <div className={homeStyle['banner']}>
          <img src={d2} alt="龙猫"/>
        </div>
        <DatePicker />
      </div>
    );
  }
}

export default Home;