import React from 'react';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Todo from './screens/Todo';

const App = () =>{
  const Tab = createBottomTabNavigator();
  return(
    <ApplicationProvider {...eva} theme={eva.light}>
      <Todo/>
    </ApplicationProvider>
  );
};

export default App;