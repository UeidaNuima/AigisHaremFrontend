/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import {
  Button,
  Container,
  Modal,
  Loader,
  Image,
  Grid,
  Menu,
  Progress,
  Segment,
} from 'semantic-ui-react';
import gql from 'graphql-tag';
// import axios from '../utils/axios';
import client from '../utils/agent';
import officeImg from '../image/office.png';
import barImg from '../image/bar.png';
import styles from './style.css';

class UnitModal extends Component {
  state = {
    unit: {
      Images: {
        Stands: [],
        CGs: [],
      },
      HarlemEventText: [],
      HarlemText: [],
      Kind: 0,
    },
    activeImg: 0,
    activeTalk: 0,
    activeTalkPage: 0,
    activeHarem: 0,
    loading: true,
    currentTab: 'image',
    version: 'a',
  };
  componentWillMount() {
    this.setState({ loading: true });
    client
      .query({
        query: gql`
          query($id: Int!) {
            card(CardID: $id) {
              CardID
              Kind
              Name
              HarlemTextA
              HarlemTextR
              ImageStand
              ImageCG
            }
          }
        `,
        variables: {
          id: this.props.match.params.id,
        },
      })
      .then(res => {
        this.setState({
          unit: {
            Images: {
              Stands: res.data.card.ImageStand,
              CGs: res.data.card.ImageCG,
            },
            HarlemEventText: res.data.card.HarlemTextA,
            HarlemText: res.data.card.HarlemTextR,
            Kind: res.data.card.Kind,
          },
          loading: false,
        });
      });

    const version = window.localStorage.getItem('version');
    this.setState({ version: version || 'a' });
  }

  render() {
    const images = [
      ...this.state.unit.Images.Stands,
      ...this.state.unit.Images.CGs,
    ];
    const currentImg = images[this.state.activeImg];
    const talks = [
      ...this.state.unit.HarlemEventText,
      ...this.state.unit.HarlemText,
    ];
    const currentTalk = talks[this.state.activeTalk];
    const harems = [];
    if (this.state.unit.HarlemEventText.length !== 0) {
      harems.push({ img: images[0], talk: talks[0], type: 'a' });
      harems.push({ img: images[0], talk: talks[1], type: 'a' });
      if (this.state.unit.HarlemEventText.length === 3) {
        harems.push({ img: images[1], talk: talks[2], type: 'a' });
      }
      if (this.state.unit.HarlemText.length !== 0) {
        harems.push({
          img: images[this.state.unit.Images.Stands.length],
          talk: talks[this.state.unit.HarlemEventText.length],
          type: 'r',
        });
        harems.push({
          img: images[this.state.unit.Images.Stands.length + 1],
          talk: talks[this.state.unit.HarlemEventText.length + 1],
          type: 'r',
        });
        if (this.state.unit.HarlemText.length === 3) {
          harems.push({
            img: images[this.state.unit.Images.Stands.length + 2],
            talk: talks[this.state.unit.HarlemEventText.length + 2],
            type: 'r',
          });
        }
      }
    }
    const currentHarem = harems[this.state.activeHarem];
    const haremTalkPages = currentHarem
      ? currentHarem.talk.split('\r\n\r\n')
      : [];
    const talkPageChange = (direction = true) => {
      if (direction && this.state.activeTalkPage < haremTalkPages.length - 1) {
        this.setState({ activeTalkPage: this.state.activeTalkPage + 1 });
      }
      if (!direction && this.state.activeTalkPage > 0) {
        this.setState({ activeTalkPage: this.state.activeTalkPage - 1 });
      }
    };
    const noJump = !!(
      this.props.location.state && this.props.location.state.noJump
    );

    return (
      <Modal
        closeIcon
        dimmer="blurring"
        basic
        size="fullscreen"
        open
        onClose={
          noJump
            ? this.props.history.goBack
            : () => {
                this.props.history.push('/');
              }
        }
      >
        <Loader disabled={!this.state.loading} size="huge" />
        <Modal.Content
          style={{
            margin: 'auto',
            padding: 0,
          }}
        >
          {this.state.currentTab === 'image' && (
            <Grid>
              <Grid.Column width={2} stretched>
                <Menu fluid vertical inverted tabular icon="labeled">
                  {this.state.unit.Images.Stands.map((img, index) => (
                    <Menu.Item
                      color="green"
                      className={`${styles.basicTab} ${styles.greenTab}`}
                      key={img}
                      icon="comment"
                      active={this.state.activeImg === index}
                      onClick={() => {
                        this.setState({ activeImg: index });
                      }}
                    />
                  ))}
                  {this.state.version === 'r' &&
                    this.state.unit.Images.CGs.map((img, index) => (
                      <Menu.Item
                        color="red"
                        className={`${styles.basicTab} ${styles.redTab}`}
                        key={img}
                        icon="heart"
                        active={
                          this.state.activeImg ===
                          index + this.state.unit.Images.Stands.length
                        }
                        onClick={() => {
                          this.setState({
                            activeImg:
                              index + this.state.unit.Images.Stands.length,
                          });
                        }}
                      />
                    ))}
                </Menu>
              </Grid.Column>
              <Grid.Column width={13}>
                {currentImg && (
                  <Image
                    key={currentImg}
                    centered
                    style={{ height: 640 }}
                    src={`http://assets.millennium-war.net${currentImg}`}
                  />
                )}
              </Grid.Column>
            </Grid>
          )}

          {this.state.currentTab === 'harem' &&
            this.state.unit.HarlemEventText.length > 0 && (
              <Grid>
                <Grid.Column width={2} stretched>
                  <Menu fluid vertical inverted tabular icon="labeled">
                    {harems
                      .filter(
                        harem =>
                          (this.state.version === 'r' && harem.type === 'r') ||
                          harem.type === 'a',
                      )
                      .map((harem, index) => (
                        <Menu.Item
                          color={harem.type === 'a' ? 'green' : 'red'}
                          className={`${styles.basicTab} ${
                            harem.type === 'a' ? styles.greenTab : styles.redTab
                          }`}
                          key={`${harem.img}-${harem.talk}`}
                          icon={harem.type === 'a' ? 'comment' : 'heart'}
                          active={this.state.activeHarem === index}
                          onClick={() => {
                            this.setState({
                              activeHarem: index,
                              activeTalkPage: 0,
                            });
                          }}
                        />
                      ))}
                  </Menu>
                </Grid.Column>
                <Grid.Column width={13}>
                  <div
                    key={`${currentHarem.img}-${currentHarem.talk}`}
                    style={{
                      height: 640,
                      width: 960,
                      background: this.state.unit.Kind
                        ? `url(http://assets.millennium-war.net${
                            currentHarem.img
                          }),url(${officeImg})`
                        : `url(http://assets.millennium-war.net${
                            currentHarem.img
                          }),url(${barImg})`,
                      backgroundSize: 'auto 640px, 960px 640px',
                      backgroundRepeat: 'no-repeat, no-repeat',
                      backgroundPosition: 'center, top left',
                      margin: 'auto',
                      position: 'relative',
                    }}
                  >
                    <Button
                      icon="angle left"
                      color="black"
                      disabled={this.state.activeTalkPage === 0}
                      onClick={() => {
                        talkPageChange(0);
                      }}
                      className={styles.gradientButton}
                    />
                    <Segment
                      basic
                      inverted
                      onClick={talkPageChange}
                      style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        bottom: 0,
                        position: 'absolute',
                        height: 200,
                        width: '100%',
                        fontSize: '1.4em',
                        userSelect: 'none',
                      }}
                    >
                      <div style={{ marginLeft: 50 }}>
                        {haremTalkPages[this.state.activeTalkPage]
                          .split('\n')
                          .map((line, index) => (
                            <span key={`${index} - ${line}`}>
                              {line}
                              <br />
                            </span>
                          ))}
                      </div>
                      <Progress
                        value={this.state.activeTalkPage + 1}
                        total={haremTalkPages.length}
                        inverted
                        attached="bottom"
                        color="green"
                      />
                    </Segment>
                  </div>
                </Grid.Column>
              </Grid>
            )}

          {this.state.currentTab === 'talk' &&
            this.state.unit.HarlemEventText.length > 0 && (
              <Grid>
                <Grid.Column width={2} stretched>
                  <Menu fluid vertical inverted tabular icon="labeled">
                    {this.state.unit.HarlemEventText.map((talk, index) => (
                      <Menu.Item
                        color="green"
                        className={`${styles.basicTab} ${styles.greenTab}`}
                        key={`${index}-${talk.substr(0, 10)}`}
                        icon="comment"
                        active={this.state.activeTalk === index}
                        onClick={() => {
                          this.setState({ activeTalk: index });
                        }}
                      />
                    ))}
                    {this.state.version === 'r' &&
                      this.state.unit.HarlemText.map((talk, index) => (
                        <Menu.Item
                          color="red"
                          className={`${styles.basicTab} ${styles.redTab}`}
                          key={`${index}-${talk.substr(0, 10)}`}
                          icon="heart"
                          active={
                            this.state.activeTalk ===
                            index + this.state.unit.HarlemEventText.length
                          }
                          onClick={() => {
                            this.setState({
                              activeTalk:
                                index + this.state.unit.HarlemEventText.length,
                            });
                          }}
                        />
                      ))}
                  </Menu>
                </Grid.Column>
                <Grid.Column width={13}>
                  <Container
                    key={currentTalk.substr(0, 10)}
                    text
                    style={{ height: 640, overflowY: 'auto', padding: 20 }}
                  >
                    {currentTalk
                      .split(/\n\n|\r\n\r\n/)
                      .map((talk, talkIndex) => (
                        <p>
                          {talk.split(/\n|\r\n/).map((line, lineIndex) => {
                            let newLine = line;
                            if (line.indexOf('＠') >= 0) {
                              newLine = <strong>{line}</strong>;
                            }
                            return (
                              <span key={`${talkIndex} - ${lineIndex}`}>
                                {newLine}
                              </span>
                            );
                          })}
                        </p>
                      ))}
                  </Container>
                </Grid.Column>
              </Grid>
            )}
        </Modal.Content>
        <Modal.Actions style={{ textAlign: 'center' }}>
          <Button.Group inverted>
            <Button
              inverted
              content="画像"
              onClick={() => {
                this.setState({ currentTab: 'image' });
              }}
              active={this.state.currentTab === 'image'}
            />
            {this.state.unit.HarlemEventText.length > 0 && (
              <Button
                inverted
                content="寝室"
                active={this.state.currentTab === 'harem'}
                onClick={() => {
                  this.setState({ currentTab: 'harem' });
                }}
              />
            )}
            {this.state.unit.HarlemEventText.length > 0 && (
              <Button
                inverted
                content="对话"
                active={this.state.currentTab === 'talk'}
                onClick={() => {
                  this.setState({ currentTab: 'talk' });
                }}
              />
            )}
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default UnitModal;
