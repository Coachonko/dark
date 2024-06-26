import { type DarkElement, component } from '@dark-engine/core';
import { Link, useMatch, useParams } from '@dark-engine/web-router';

import { useProduct } from '../hooks';
import { Spinner, Error, Card, Button } from './ui';

const ProductCard = component<{ slot: DarkElement }>(({ slot }) => {
  const params = useParams();
  const id = Number(params.get('id'));
  const { isFetching, data, error } = useProduct(id);
  const { url } = useMatch();
  const urlToEdit = url + '/edit';
  const urlToRemove = url + '/remove';

  if (isFetching && !data) return <Spinner />;
  if (error) return <Error value={error} />;

  if (!data) {
    return (
      <Card>
        <h3>It seems there is no product with #{id} 🤫</h3>
      </Card>
    );
  }

  if (slot) return slot;

  return (
    <Card>
      <h3>{data.name}</h3>
      <p>{data.description}</p>
      <Button as={Link} {...{ to: urlToEdit }}>
        Edit
      </Button>
      <Button as={Link} {...{ to: urlToRemove }}>
        Remove
      </Button>
    </Card>
  );
});

export default ProductCard;
