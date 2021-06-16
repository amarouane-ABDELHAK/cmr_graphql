const got = require('got');

const cmrEndpoint = "https://cmr.earthdata.nasa.gov/search";
const trim = (str, chars) => str.split(chars).filter(Boolean).join(chars);
async function searchCmrCollections(concept_id, short_name, page_size) {
  
  const conceptIdQuery = concept_id ? "concept_id=" + concept_id : "";
  const shortNameQuery = short_name ? "short_name=" + short_name : "";
  let query = "";
  if (concept_id && short_name) {
    query = conceptIdQuery + "&" + shortNameQuery;
  }
  else if (concept_id) {
    query = conceptIdQuery;
  }
  else if (short_name) {
    query = shortNameQuery;
  }
  page_size = page_size ? page_size:1


  const response = await got(cmrEndpoint + `/collections.json?page_size=${page_size}&${query}&include_granule_counts=true`);
  return JSON.parse(response.body).feed.entry;
}

async function searchCmrGranules(parent, args, context, info, page_size) {
  // Default page size to 4
  page_size = page_size ? page_size:4
  const collectionId = parent.id;
  const response = await got(`${cmrEndpoint}/granules.json?page_size=${page_size}&collection_concept_id=${collectionId}`);
  return JSON.parse(response.body).feed.entry;
}

async function mysearchCmrGranules(concept_id, short_name, page_size, offset) {
 // Default page size to 4
 page_size = page_size ? page_size:4
 offset = offset ? offset :0
 const conceptIdQuery = concept_id ? "collection_concept_id=" + concept_id : "";
  const shortNameQuery = short_name ? "short_name=" + short_name : "";
  let query = "";
  if (concept_id && short_name) {
    query = conceptIdQuery + "&" + shortNameQuery;
  }
  else if (concept_id) {
    query = conceptIdQuery;
  }
  else if (short_name) {
    query = shortNameQuery;
  }
  

  const response = await got(`${cmrEndpoint}/granules.json?page_size=${page_size}&${query}&offset=${offset}`);
  return JSON.parse(response.body).feed.entry;



}

async function searchCmrUMMVars(concept_id, name) {
  const conceptIdQuery = concept_id ? `concept_id=${concept_id}` : "";
  const nameQuery = name ? `name=${name}` : "";
  const query = trim(`${conceptIdQuery}&${nameQuery}`, '&')
  const response = await got(`${cmrEndpoint}/variables.json?page_size=4&${query}`);
  return JSON.parse(response.body).items;
  
  
}

async function searchCmrVariables(collection) {
  const associations = collection.associations;
  if (associations != undefined) {
    const variableConceptIds = associations.variables;
    if (variableConceptIds != undefined) {
      const queryStr = (variableConceptIds.length > 0) ? "concept_id=" + variableConceptIds.join("&concept_id=") : "";
      const response = await got(`${cmrEndpoint}/variables.json?page_size=4&${queryStr}`);
      return JSON.parse(response.body).items;
    }
  }
  return null;
}

async function searchCmrServices(collection) {
  const associations = collection.associations;
  if (associations != undefined) {
    const serviceConceptIds = associations.services;
    if (serviceConceptIds != undefined) {
      const queryStr = (serviceConceptIds.length > 0) ? "concept_id=" + serviceConceptIds.join("&concept_id=") : "";
      const response = await got(`${cmrEndpoint}/services.json?page_size=4&${queryStr}`);
      return JSON.parse(response.body).items;
    }
  }
  return null;
}

function isBrowseLink(link) {
  return link.rel === "http://esipfed.org/ns/fedsearch/1.1/browse#";
}

function isDownloadLink(link) {
  return link.rel === "http://esipfed.org/ns/fedsearch/1.1/data#" && link.inherited != true;
}

function getBrowseLink(concept) {
  const links = concept.links.filter(isBrowseLink);
  if (links.length > 0) {
    return links[0].href;
  }
  return null;
}

function getDownloadLink(concept) {
  const links = concept.links.filter(isDownloadLink);
  if (links.length > 0) {
    return links[0].href;
  }
  return null;
}

module.exports = {searchCmrCollections, searchCmrUMMVars, searchCmrGranules, mysearchCmrGranules, searchCmrVariables, searchCmrServices, getBrowseLink, getDownloadLink};