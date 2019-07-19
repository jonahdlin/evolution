import React from 'react';

/* Constants */

/* Utils */

/* Child Components */
import Typography from '@material-ui/core/Typography';

/* Styled Components */
import {
  CreatureInfoWrapper,
  CreatureInfoPiece,
} from '../styles/CreatureInfo';

const CreatureInfo = ({
  creature,
}) => {
  const renderStatus = () => {
    const statusObj = creature.status;
    return Object.keys(statusObj).map(status => (
      <CreatureInfoPiece key={status}>
        <Typography>{statusObj[status].displayName}</Typography>
        <Typography>{statusObj[status].value}</Typography>
      </CreatureInfoPiece>
    ));
  };

  const renderGenes = () => {
    const genesObj = creature.genes;
    return Object.keys(genesObj).map(gene => (
      <CreatureInfoPiece key={gene}>
        <Typography>{genesObj[gene].displayName}</Typography>
        <Typography>{genesObj[gene].value}</Typography>
      </CreatureInfoPiece>
    ));
  };

  return creature
    ? (
      <CreatureInfoWrapper>
        <h2>Status</h2>
        {renderStatus()}
        <h2>Genes</h2>
        {renderGenes()}
      </CreatureInfoWrapper>
    ) : <div>Select a creature by clicking on it</div>;
};

export default CreatureInfo;
