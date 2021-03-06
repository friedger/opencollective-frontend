import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { get } from 'lodash';

import withIntl from '../lib/withIntl';
import { withUser } from '../components/UserProvider';
import ErrorPage from '../components/ErrorPage';
import Page from '../components/Page';
import Loading from '../components/Loading';
import TierPageContent from '../components/tier-page';

/**
 * The main page to display collectives. Wrap route parameters and GraphQL query
 * to render `components/collective-page` with everything needed.
 */
class TierPage extends React.Component {
  static propTypes = {
    tierId: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired, // from withData
    LoggedInUser: PropTypes.object, // from withUser
  };

  static getInitialProps({ query: { tierId } }) {
    return { tierId };
  }

  // See https://github.com/opencollective/opencollective/issues/1872
  shouldComponentUpdate(newProps) {
    if (get(this.props, 'data.Tier') && !get(newProps, 'data.Tier')) {
      return false;
    } else {
      return true;
    }
  }

  getPageMetaData(tier) {
    if (tier && tier.collective) {
      const collective = tier.collective;
      return {
        title: `${collective.name} - ${tier.name}`,
        description: tier.description || collective.description || collective.longDescription,
        twitterHandle: collective.twitterHandle || get(collective, 'parentCollective.twitterHandle'),
        image: collective.image || get(collective, 'parentCollective.image'),
      };
    } else {
      return {
        title: 'Tier',
        image: '/static/images/defaultBackgroundImage.png',
      };
    }
  }

  render() {
    const { data, LoggedInUser } = this.props;

    return !data || data.error ? (
      <ErrorPage data={data} />
    ) : (
      <Page {...this.getPageMetaData(data.Tier)}>
        {data.loading || !data.Tier || !data.Tier.collective ? (
          <Loading />
        ) : (
          <TierPageContent collective={data.Tier.collective} tier={data.Tier} LoggedInUser={LoggedInUser} />
        )}
      </Page>
    );
  }
}

const getCollective = graphql(gql`
  query TierPage($tierId: Int!) {
    Tier(id: $tierId) {
      id
      name
      slug
      longDescription
      goal
      currency
      interval

      stats {
        totalDonated
        totalRecurringDonations
      }

      collective {
        id
        slug
        type
        name
        image
        backgroundImage
        parentCollective {
          id
          twitterHandle
          image
        }
      }
    }
  }
`);

export default withUser(getCollective(withIntl(TierPage)));
