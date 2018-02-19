import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { STATIC_BASE_URL } from '../utils/constants';

export default withRouter(({ unit, history }) => {
  const handleClick = () => {
    history.push({
      pathname: `/unit/${unit.CardID}`,
      state: { noJump: true },
    });
  };
  return (
    <Card onClick={handleClick}>
      <Card.Content>
        <Image src={`${STATIC_BASE_URL}/img/${unit.CardID}/INIT.png`} size="tiny" floated="left" verticalAlign="middle" />
        <Card.Header>
          {unit.Name}
        </Card.Header>
        <Card.Meta>
          {unit.RealName}
        </Card.Meta>
        <Card.Meta>
          No.<strong>{unit.CardID}</strong>
        </Card.Meta>
      </Card.Content>
    </Card>
  );
});
