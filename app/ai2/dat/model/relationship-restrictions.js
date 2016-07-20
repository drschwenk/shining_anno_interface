'use strict';

const RelationshipRestrictionsPerCat = {
  IntraObjectLinkage: 3,
  InterObjectLinkage: 3,
  IntraObjectLabel: 2,
  IntraObjectLoop: 2,
  arrowDescriptor: 2,
  intraObjectRegionLabel: 2,
  sectionTitle: 1,
  imageTitle: 1,
  imageCaption: 1,
  textMisc: 1
}
Object.freeze(RelationshipRestrictionsPerCat);

module.exports = RelationshipRestrictionsPerCat;
