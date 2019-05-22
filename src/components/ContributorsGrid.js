import React from 'react';
import PropTypes from 'prop-types';
import { Flex } from '@rebass/grid';

import Roles from '../constants/roles';
import { CollectiveType } from '../constants/collectives';

const ContributorsGrid = ({ members }) => {
  return (
    <Flex>
      {members.map(member => (
        <div key={member.id}>TODO</div>
      ))}
    </Flex>
  );
};

ContributorsGrid.propTypes = {
  /** The members that contribute to this collective */
  members: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      role: PropTypes.oneOf(Object.values(Roles)).isRequired,
      collective: PropTypes.shape({
        id: PropTypes.number.isRequired,
        type: PropTypes.oneOf(Object.values(CollectiveType)).isRequired,
        slug: PropTypes.string.isRequired,
        name: PropTypes.string,
        image: PropTypes.string,
      }).isRequired,
    }),
  ),
};

export default ContributorsGrid;
