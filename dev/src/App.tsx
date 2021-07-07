import * as React from 'react';

import { ThemeSwitcherProvider } from 'react-css-theme-switcher';

import Basic from "./components/examples/Basic";
import Basic2 from "./components/examples/Basic2";
import Basic3 from "./components/examples/Basic3";
import Basic4 from "./components/examples/Basic4";
import ExpandControlled from "./components/examples/ExpandControlled";
import FocusingControlled from "./components/examples/FocusingControlled";
import CheckingControlled from "./components/examples/CheckingControlled";
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
							<Basic themeName={this.state.themeName}></Basic>
							<Basic2 themeName={this.state.themeName}></Basic2>
							<Basic3 themeName={this.state.themeName}></Basic3>
							<Basic4 themeName={this.state.themeName}></Basic4>
						</div>
						<div className="controlled-grid-layout">
							<ExpandControlled themeName={this.state.themeName}></ExpandControlled>
							<FocusingControlled themeName={this.state.themeName}></FocusingControlled>
							<CheckingControlled themeName={this.state.themeName}></CheckingControlled>
						</div>
						<div className="controlled-grid-layout">
							<ErrorScenario themeName={this.state.themeName}></ErrorScenario>
							<DisabledTree themeName={this.state.themeName}></DisabledTree>
							<CustomCellRender themeName={this.state.themeName}></CustomCellRender>
						</div>
					</ThemeSwitcherProvider>
				</div>
			</React.Suspense>
		)
	}
}
