const {makeExecutableSchema} = require('graphql-tools');
const {searchCmrCollections, searchCmrGranules, mysearchCmrGranules, searchCmrVariables, searchCmrServices, getBrowseLink, getDownloadLink} = require('./cmr.js');

// Construct a schema, using GraphQL schema language
// TODO - figure out associations, orbit_parameters, links (would be good to add top level browseLink and downloadLink fields)
const typeDefs = `
  type Granule {
    id: ID!
    time_start: String
    online_access_flag: Boolean
    points: [String]
    day_night_flag: String
    browse_flag: Boolean
    time_end: String
    coordinate_system: String
    original_format: String
    collection_concept_id: String
    data_center: String
    links: [String]
    dataset_id: String
    title: String
    updated: String
    browse_link: String
    download_link: String
  }

  type Variable {
    concept_id: ID!
    revision_id: Int
    provider_id: String
    native_id: String
    name: String
    long_name: String
  }

  type Service {
    concept_id: ID!
    revision_id: Int
    provider_id: String
    native_id: String
    name: String
    long_name: String
  }

  type Collection {
    id: ID!
    short_name: String
    boxes: [String]
    time_start: String
    dif_ids: [String]
    version_id: String
    dataset_id: String
    has_spatial_subsetting: Boolean
    has_transforms: Boolean
    has_variables: Boolean
    data_center: String
    organizations: [String]
    title: String
    coordinate_system: String
    summary: String
    has_formats: Boolean 
    original_format: String
    archive_center: String
    has_temporal_subsetting: Boolean
    browse_flag: Boolean
    online_access_flag: Boolean
    granules: [Granule]
    variables: [Variable]
    services: [Service]
  }

  type Query {
    collections(concept_id: String, short_name: String, page_size: Int): [Collection],
    granules(concept_id: String, short_name: String, page_size: Int, offset: Int): [Granule]
  }
`;

const resolvers = {
  Query: {
    collections: (parent, { concept_id, short_name, page_size }, context, info) => searchCmrCollections(concept_id, short_name, page_size),
    granules: (parent, { concept_id, short_name, page_size, offset }, context, info) => mysearchCmrGranules(concept_id, short_name, page_size, offset)
  },
  Collection: {
    granules: (parent, args, context, info, page_size) => searchCmrGranules(parent, args, context, info, page_size),
    variables: (parent, args, context, info) => searchCmrVariables(parent),
    services: (parent, args, context, info) => searchCmrServices(parent)
  },
  Granule: {
    browse_link: (parent, args, context, info) => getBrowseLink(parent),
    download_link: (parent, args, context, info) => getDownloadLink(parent)
  }
};

executableSchema = makeExecutableSchema({
  "typeDefs": [typeDefs],
  "resolvers": resolvers
});

module.exports = {
  executableSchema,
  typeDefs,
  resolvers
};