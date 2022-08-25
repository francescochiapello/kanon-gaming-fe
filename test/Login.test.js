// Login.test.js
import React from 'react';
import { shallow } from 'enzyme';
import Login from '../src/Pages/Login';

describe("Login", () => {
  it("should render my component", () => {
    const wrapper = shallow(<Login />);
  });
});