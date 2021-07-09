import * as React from 'react';

import { ThemeSwitcherProvider } from 'react-css-theme-switcher';

import Basic from "./components/examples/Basic";
import Basic2 from "./components/examples/Basic2";
import Basic3 from "./components/examples/Basic3";
import Basic4 from "./components/examples/Basic4";
import ExpandControlled from "./components/examples/ExpandControlled";
import FocusingControlled from "./components/examples/FocusingControlled";
import CheckingControlled from "./components/examples/CheckingControlled";
import PreparedControlled from "./components/examples/PreparedControlled";
import ErrorScenario from "./components/examples/ErrorScenario";
import DisabledTree from "./components/examples/DisabledTree";
import CustomCellRender from "./components/examples/CustomCellRender";

import './App.css';

const themes = {
	light: '/Tree.light.css',
	dark: '/Tree.dark.css',
};

type AppState = {
	themeName: string;
}

export default class App extends React.Component<{}, AppState> {

	state = {
		themeName: "light"
	}

	private onToggleTheme = () => {
		this.setState((prevState: AppState) => (
			{ themeName: prevState.themeName === "light" ? "dark" : "light" }
		));
	}

	render() {

		const basics: Array<React.ReactNode> = [];
		basics.push(<Basic key="1" themeName={this.state.themeName}></Basic>);
		basics.push(<Basic2 key="2" themeName={this.state.themeName}></Basic2>);
		basics.push(<Basic3 key="3" themeName={this.state.themeName}></Basic3>);
		basics.push(<Basic4 key="4" themeName={this.state.themeName}></Basic4>);

		const controlleds: Array<React.ReactNode> = [];
		controlleds.push(<ExpandControlled key="1" themeName={this.state.themeName}></ExpandControlled>);
		controlleds.push(<FocusingControlled key="2" themeName={this.state.themeName}></FocusingControlled>);
		controlleds.push(<CheckingControlled key="3" themeName={this.state.themeName}></CheckingControlled>);
		controlleds.push(<PreparedControlled key="4" themeName={this.state.themeName}></PreparedControlled>);

		const others: Array<React.ReactNode> = [];
		others.push(<ErrorScenario key="1" themeName={this.state.themeName}></ErrorScenario>);
		others.push(<DisabledTree key="2" themeName={this.state.themeName}></DisabledTree>);
		others.push(<CustomCellRender key="3" themeName={this.state.themeName}></CustomCellRender>);

		return (
			<React.Suspense fallback={null}>
				<div className="height100">
					<button className="margin12" style={{ marginTop: '12px' }} onClick={this.onToggleTheme}>Toggle Theme</button>
					<ThemeSwitcherProvider
						defaultTheme={this.state.themeName}
						insertionPoint={document.getElementById('inject-styles-here')}
						themeMap={themes}
					>
						<div className="basic-grid-layout">
							{basics}
						</div>
						<div className="controlled-grid-layout">
							{controlleds}
						</div>
						<div className="controlled-grid-layout">
							{others}
						</div>
					</ThemeSwitcherProvider>
				</div>
			</React.Suspense>
		)
	}
}
