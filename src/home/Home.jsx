import React from 'react';
import { Container, Header, Image, Segment } from 'semantic-ui-react';
import logoImg from '../image/logo.png';
import payImg from '../image/pay.png';

export default () => (
  <Container style={{ padding: 20 }}>
    <Segment basic>
      <Image src={logoImg} size="small" centered />
      <Header as="h1" textAlign="center">
        Naberius / Event
        <Header.Subheader>←左边选择稀有度</Header.Subheader>
      </Header>
    </Segment>
    <Header as="h2" dividing>
      这是啥
    </Header>
    <p>
      这是一个关于<a href="http://www.dmm.com/netgame_s/aigisc/">千年战争</a>
      的立绘&对话收集站。
    </p>
    <p>一切版权归DMM GAMES所有。</p>
    <p>如果看到了一些全白的白图或者全黑的黑图都是正常的，蛤蛤蛤</p>
    <p>
      说来这个logo本来想画个狗头的，在画的时候感觉还不错，画完了一看这tm不是海豚吗
    </p>
    <p>
      <time>2018/11/17</time>
      修改了后端接口，虽然以后可能还会产生别的问题但是应该不会丢文本了
    </p>
    <Header as="h2" dividing>
      <del>生活所迫</del>，支付宝
    </Header>
    <div style={{ textAlign: 'center' }}>
      <img alt="支付宝@13021225563" width={200} src={payImg} />
    </div>
  </Container>
);
