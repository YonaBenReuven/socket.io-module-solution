import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ChatList from './components/ChatList';
import Chat from './components/Chat';
import './App.scss';

const App = () => {
	return (
		<Switch>
			<Route path="/" exact component={ChatList} />
			<Route path="/:chatName" component={Chat} />
		</Switch>
	);
}

export default App;
