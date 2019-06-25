import React, { Component } from 'react';
import { Route, Switch, NavLink, withRouter } from 'react-router-dom';
import { Menu, Image, Icon, Sidebar, Responsive } from 'semantic-ui-react';
import logoImg from '../image/logo.png';
import logoImgR from '../image/logor.png';
import Home from '../home/Home';
import CardsContainer from '../cards-container/CardsContainer';
import UnitModal from '../unit-modal/UnitModal';
import styles from './style.css';

class App extends Component {
  constructor(props) {
    super();
    this.previousLocation = props.location;
    this.state = {
      click: 0,
      version: 'a',
      sidebarVisible: false,
      width: 0,
    };
  }

  componentWillMount() {
    const version = window.localStorage.getItem('version');
    this.setState({ version: version || 'a' });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.setState({ sidebarVisible: false });
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.history.action !== 'POP') {
      this.previousLocation = this.props.location;
    }
  }

  transform = () => {
    if (this.state.click === 10) {
      if (this.state.version === 'a') {
        this.setState({
          click: 0,
          version: 'r',
        });
        window.localStorage.setItem('version', 'r');
      } else {
        this.setState({
          click: 0,
          version: 'a',
        });
        window.localStorage.setItem('version', 'a');
      }
    } else {
      this.setState({ click: this.state.click + 1 });
    }
  };

  toggleSidebar = () => {
    this.setState(state => ({ sidebarVisible: !state.sidebarVisible }));
  };

  handlePusherClick = () => {
    if (this.state.sidebarVisible) {
      this.setState({ sidebarVisible: false });
    }
  };

  render() {
    const { location } = this.props;
    const noJump = !!(
      location.state &&
      location.state.noJump &&
      this.previousLocation !== location
    );
    return (
      <div className="App" style={{ height: '100%' }}>
        <Sidebar.Pushable>
          <Sidebar
            visible={
              this.state.width >= Responsive.onlyMobile.maxWidth
                ? true
                : this.state.sidebarVisible
            }
            as={Menu}
            vertical
            inverted
            fixed="left"
            // style={{ width: 200 }}
          >
            <NavLink to="/" className={`item ${styles.menuWhite}`} exact>
              <Image
                onClick={this.transform}
                src={this.state.version === 'a' ? logoImg : logoImgR}
                size="mini"
                spaced="right"
                alt="logo"
              />
              <span>Naberius / Event</span>
            </NavLink>
            <NavLink
              to="/rarity/iron"
              className={`grey item ${styles.menuIron}`}
            >
              <Icon name="circle" color="grey" />
              アイアン / 铁
            </NavLink>
            <NavLink
              to="/rarity/bronze"
              className={`brown item ${styles.menuBrown}`}
            >
              <Icon name="circle" color="brown" />
              ブロンズ / 铜
            </NavLink>
            <NavLink
              to="/rarity/silver"
              className={`item ${styles.menuSilver}`}
            >
              <Icon name="circle" color="grey" />
              シルバー / 银
            </NavLink>
            <NavLink
              to="/rarity/gold"
              className={`yellow item ${styles.menuYellow}`}
            >
              <Icon name="circle" color="yellow" />
              ゴールド / 金
            </NavLink>
            <NavLink
              to="/rarity/platinum"
              className={`item ${styles.menuWhite}`}
            >
              <Icon name="circle" />
              <span>プラチナ / 白</span>
            </NavLink>
            <NavLink
              to="/rarity/black"
              className={`black item ${styles.menuBlack}`}
            >
              <Icon name="circle" color="black" />
              ブラック / 黑
            </NavLink>
            <NavLink
              to="/rarity/sapphire"
              className={`blue item ${styles.menuBlue}`}
            >
              <Icon name="circle" color="blue" />
              サファイア / 蓝
            </NavLink>
          </Sidebar>
          <Sidebar.Pusher
            dimmed={this.state.sidebarVisible}
            onClick={this.handlePusherClick}
          >
            {/* <div style={{ marginLeft: 200 }}> */}
            <Responsive
              {...Responsive.onlyMobile}
              fireOnMount
              onUpdate={(e, { width }) => this.setState({ width })}
            >
              <Menu fixed="top" inverted>
                <Menu.Item onClick={this.toggleSidebar}>
                  <Icon name="sidebar" />
                </Menu.Item>
              </Menu>
              <div style={{ marginTop: 40 }} />
            </Responsive>
            <Switch location={noJump ? this.previousLocation : location}>
              <Route path="/rarity/:rarity" component={CardsContainer} />
              <Route path="/" component={Home} />
            </Switch>
            <Route path="*/unit/:id" component={UnitModal} />
            {/* </div> */}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default withRouter(App);
