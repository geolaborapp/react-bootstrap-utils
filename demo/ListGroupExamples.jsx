import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { ListGroup, StatefulListGroup } from '../dist/main';

const items = [
  {
    title: 'Cras justo odio',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi doloremque itaque in tenetur quidem ab provident repellat vero commodi iste? Itaque sed mollitia dolores voluptatibus at tenetur totam aperiam incidunt.',
    archived: true,
  },
  {
    title: 'Morbi leo risus',
    description:
      'Magnam, amet assumenda fuga architecto cumque quod exercitationem temporibus facere aperiam officiis eaque odio sequi maxime dolores ullam earum, quidem voluptatibus quisquam qui dolor culpa illo. Saepe minus optio labore.',
  },
  {
    title: 'Porta ac consectetur ac',
    description:
      'Doloribus exercitationem vero, tenetur, ratione eius ipsum illo ipsa amet consequuntur adipisci perspiciatis labore aperiam mollitia molestias recusandae rerum dolorum alias dolores optio. Ea dignissimos nemo nostrum impedit quo sequi.',
  },
];

const itemsWithBackgrounds = [
  {
    title: 'Primary Item',
    description: 'This is a primary colored list item.',
    background: 'primary',
  },
  {
    title: 'Success Item',
    description: 'This is a success colored list item.',
    background: 'success',
  },
  {
    title: 'Danger Item',
    description: 'This is a danger colored list item.',
    background: 'danger',
  },
  {
    title: 'Warning Item',
    description: 'This is a warning colored list item.',
    background: 'warning',
  },
  {
    title: 'Info Item',
    description: 'This is an info colored list item.',
    background: 'info',
  },
];

export function ListGroupExamples() {
  return (
    <div className="row">
      <div className="col-6 mb-3">
        <h1 className="h4">Simple list group</h1>
        <ListGroup
          items={items}
          template={(item, index) => (
            <>
              <em>{index + 1} </em>
              <strong>{item.title}</strong> <br />
              {item.description}
            </>
          )}
          // eslint-disable-next-line no-console
          onSelect={console.warn}
        />
      </div>
      <div className="col-6 mb-3">
        <h1 className="h4">Linked list group</h1>
        <ListGroup
          items={items}
          template={(item) => (
            <>
              <strong>{item.title}</strong> <br />
              {item.description}
            </>
          )}
          active={2}
          linked={true}
          isDisabled={(item) => item.archived}
        />
      </div>
      <div className="col-6 mb-3">
        <h1 className="h4">No border list group</h1>
        <ListGroup
          items={items}
          template={(item) => (
            <>
              <strong>{item.title}</strong> <br />
              {item.description}
            </>
          )}
          active={2}
          bordered={false}
        />
      </div>
      <div className="col-6 mb-3">
        <h1 className="h4">Horizontal list group</h1>
        <ListGroup
          items={items}
          template={(item) => (
            <>
              <strong>{item.title}</strong> <br />
              {item.description}
            </>
          )}
          active={1}
          horizontal={true}
        />
      </div>
      <div className="col-6 mb-3">
        <h1 className="h4">Stateful list group</h1>
        <StatefulListGroup
          items={items}
          template={(item) => (
            <>
              <strong>{item.title}</strong> <br />
              {item.description}
            </>
          )}
          linked={true}
        />
      </div>
      <div className="col-6 mb-3">
        <h1 className="h4">List group with item backgrounds</h1>
        <ListGroup
          items={itemsWithBackgrounds}
          template={(item) => (
            <>
              <strong>{item.title}</strong> <br />
              {item.description}
            </>
          )}
        />
      </div>
      <div className="col-6 mb-3">
        <h1 className="h4">Linked list group with backgrounds</h1>
        <ListGroup
          items={itemsWithBackgrounds}
          template={(item) => (
            <>
              <strong>{item.title}</strong> <br />
              {item.description}
            </>
          )}
          linked={true}
        />
      </div>
    </div>
  );
}
