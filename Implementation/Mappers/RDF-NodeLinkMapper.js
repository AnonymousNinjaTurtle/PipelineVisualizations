// data handler is a base class;
import BaseComponent from "../Base/BaseComponent";
import * as $CONST from "../Base/BaseComponentConstants";

import Node from "../Models/Node";
import Link from "../Models/Link";
import LanguageTools from "../Base/LanguageTools";
import { validIRI } from "../Base/globalHelper";
import NodeLinkModel from "../Models/NodeLinkModel";
import { node } from "prop-types";

export default class NodeLinkMapper extends BaseComponent {
  constructor() {
    super();
    this.type = $CONST.TYPE_VERTEX_EDGE_MAPPER; // default type;

    this.requestedInputType = $CONST.TYPE_VERTEX_EDGE_MODEL;
    this.hasCompatibleInput = false;

    this.prefixMapperL2S = {
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#": "rdf",
      "http://www.w3.org/2000/01/rdf-schema#": "rdfs",
      "http://www.w3.org/2002/07/owl#": "owl",
      "http://www.w3.org/2001/XMLSchema#": "xsd",
      "http://purl.org/dc/elements/1.1/": "dc",
      "http://www.w3.org/XML/1998/namespace": "xml",
      "http://xmlns.com/wot/0.1/": "wot",
      "http://www.w3.org/2003/06/sw-vocab-status/ns#": "vs",
      "http://xmlns.com/foaf/0.1/": "foaf",
      "http://www.w3.org/2004/02/skos/core#": "skos"
    };

    this.definitionMap = {
      nodeMapper: {
        __nodeType: "__vertexType",
        __nodeLinkIdentifier: "__vertexEdgeIdentifier",
        __displayName: "__displayName"
      },
      linkMapper: {
        __linkType: "__edgeType",
        __nodeLinkIdentifier: "__vertexEdgeIdentifier",
        __displayName: "__displayName",
        __linkAxiom: "__edgeAxiom"
      },
      nodeMerge: [
        // {
        //   __linkType: "axiomLink",
        //   __displayName: "owl:equivalentClass"
        // }
      ],
      nodeSplit: [
        // {
        //   constraints: "none",
        //   type: ["rdfs:Literal"]
        //   // there could be more types like xsd:datatype or so
        // }
      ],
      auxiliaryNodes: [
        {
          edgeType: ["owl:ObjectProperty"], // constraint
          auxiliaryLinks: {
            source: ["domain", "auxLink"],
            target: ["range", "auxLink"]
          }, // what to do whit the link >> split domain range links << this sets the displayName and edge type
          auxiliaryNode: ["__displayName", "auxForObjectProperties"] // will fetch the prop name for display name and set the type to auxiliary
        },
        {
          edgeType: ["owl:DatatypeProperty"], // constraint
          auxiliaryLinks: {
            source: ["domain", "auxLink"],
            target: ["range", "auxLink"]
          }, // what to do whit the link >> split domain range links << this sets the displayName and edge type
          auxiliaryNode: ["__displayName", "auxForDataTypeProperties"] // will fetch the prop name for display name and set the type to auxiliary
        }
      ]
    };
  }

  /** -------------- EXPOSED FUNCTIONS -------------- DO NOT OVERWRITE **/
  setInputData = inputDataAsJsonObject => {
    this.inputDataAsJsonObject = inputDataAsJsonObject;
    // check if type is compatible;
    if (this.requestedInputType === inputDataAsJsonObject.resultingModel.type) {
      this.hasCompatibleInput = true;
    } else {
      console.error(
        "INPUT MODEL IS OF TYPE " +
          inputDataAsJsonObject.resultingModel.type +
          "EXPECTED: " +
          this.requestedInputType
      );
    }
  };

  /** -------------- Must OVERWRITE FUNCTIONS --------------**/
  __run__ = () => {
    if (this.hasCompatibleInput) {
      this.__mapInputModel();
    } else {
      console.error("CANCELLED!");
      this.resultObject.resultingModel = null;
    }
  };

  __mapInputModel = () => {
    // obtain the data items;
    const model = this.inputDataAsJsonObject.resultingModel;

    const modelData = model.getResult();
    const resourceIdentifier = model.getResourceIdentifier();

    const nlModel = new NodeLinkModel();
    nlModel.setResourceIdentifier("__nodeLinkIdentifier"); // lookup name

    this.__mapVerticesToNodes(nlModel, modelData.vertices);
    this._mapEdgesToLinks(nlModel, modelData.edges);

    this._mergeAndSplitNodes(nlModel);
    this._introduceAuxiliaryNode(nlModel);

    this.resultObject.resultingModel = nlModel;
  };

  _introduceAuxiliaryNode(model) {
    if (this.definitionMap.auxiliaryNodes) {
      const def = this.definitionMap.auxiliaryNodes;
      const links = model.modelAsJsonObject.links;

      links.forEach(link => {
        const auxDef = this._auxApplies(link, def);
        if (auxDef !== false) {
          link.__SHADOWLINK = true;

          // create a link for the property using the auxDef.auxiliaryNodeDefinition;
          const auxNode = new Node();
          if (auxDef.auxNode[0] === "__displayName") {
            auxNode.__displayName = link.__displayName;
          } else {
            auxNode.__displayName = auxDef.auxNode[0];
          }
          auxNode.__nodeType = [auxDef.auxNode[1]];
          auxNode.resourceReference = link;
          // create the links;

          const auxLink1 = new Link();
          const link1Def = auxDef.auxLinks.source;
          auxLink1.__displayName = link1Def[0];
          auxLink1.__linkType = link1Def[1];
          auxLink1.__source = auxNode;
          auxLink1.__target = link.__source;

          const auxLink2 = new Link();
          const link2Def = auxDef.auxLinks.target;
          auxLink2.__displayName = link2Def[0];
          auxLink2.__linkType = link2Def[1];
          auxLink2.__source = auxNode;
          auxLink2.__target = link.__target;

          // todo, adjust ids;
          auxNode.__nodeLinkIdentifier =
            link.__source.__nodeLinkIdentifier +
            "$$" +
            link.__nodeLinkIdentifier +
            "$$" +
            link.__target.__nodeLinkIdentifier +
            "$$_AUXNODE";

          auxLink1.__nodeLinkIdentifier =
            link.__source.__nodeLinkIdentifier +
            "$$" +
            link.__nodeLinkIdentifier +
            "$$" +
            link.__target.__nodeLinkIdentifier +
            "$$_AUXLINK1";

          auxLink2.__nodeLinkIdentifier =
            link.__source.__nodeLinkIdentifier +
            "$$" +
            link.__nodeLinkIdentifier +
            "$$" +
            link.__target.__nodeLinkIdentifier +
            "$$_AUXLINK2";

          model.addNode(auxNode);
          model.addLink(auxLink1);
          model.addLink(auxLink2);
        }
      });
    }
    model.removeShadowsFromModel();
  }

  _mergeAndSplitNodes(model) {
    this._mergeNodes(model);
    model.removeShadowsFromModel();

    this._splitNodes(model); // this creates clones ad redirects the links;
    model.removeShadowsFromModel();
  }

  _splitNodes(model) {
    const links = model.modelAsJsonObject.links;
    const splitDefs = this.definitionMap.nodeSplit;

    const linksToSplit = [];
    links.forEach(link => {
      const splitAppliesTarget = this._splitAppliesOnTarget(link, splitDefs);
      if (splitAppliesTarget) {
        linksToSplit.push(link);
      }
    });
    let cloneIterator = 0;
    linksToSplit.forEach(link => {
      // what we do is we clone the target node and adjust the link;
      const nodeToClone = link.__target;
      nodeToClone.__SHADOWNODE = true; // will be removed
      const newNode = new Node();
      for (const name in nodeToClone) {
        if (nodeToClone.hasOwnProperty(name)) {
          if (name !== "__outgoingLinks" && name !== "__incomingLinks") {
            newNode[name] = nodeToClone[name];
          }
        }
      }

      newNode.__nodeLinkIdentifier =
        newNode.__nodeLinkIdentifier + "$$Clone" + cloneIterator;
      newNode.__SHADOWNODE = false;
      model.addNode(newNode);
      link.__target = newNode;
      cloneIterator++;
    });
  }

  _mergeNodes(model) {
    // we merge nodes based on the links they have;

    const links = model.modelAsJsonObject.links;
    const mergeDefs = this.definitionMap.nodeMerge;

    const linksToMerge = [];
    links.forEach(link => {
      const mergeApplies = this._mergeApplies(link, mergeDefs);
      if (mergeApplies) {
        link.__SHADOWLINK = true;
        linksToMerge.push(link);
      }
    });
    linksToMerge.forEach(link => {
      const tokens = link.__nodeLinkIdentifier.split("$$");
      const srcNode = model.getNodeFromName(tokens[0]);
      const tarNode = model.getNodeFromName(tokens[2]);
      // merge the nodes;
      model.mergeNodes(srcNode, tarNode);
    });
  }

  _mergeApplies(link, constraints) {
    let compares = 0;
    let validCompares = 0;
    let applies = false;
    constraints.forEach(cons => {
      for (const name in cons) {
        if (cons.hasOwnProperty(name)) {
          //name is the datatype value
          const linkData = link[name];
          const compareValue = cons[name];
          compares++;
          if (linkData === compareValue) {
            validCompares++;
          }
        }
      }
      // found at least one definition that requests this merge;
      if (validCompares === compares) {
        applies = true;
        return applies;
      }
    });
    return applies;
  }

  _auxApplies(link, constraints) {
    for (let i = 0; i < constraints.length; i++) {
      for (const name in constraints[i]) {
        if (constraints[i].hasOwnProperty(name)) {
          //name is the datatype value

          if (name === "edgeType") {
            const lT = link.__linkType;
            const cT = constraints[i][name];

            if (typeof lT === "string") {
              for (let j = 0; j < cT.length; j++) {
                if (lT.toLowerCase() === cT[j].toLowerCase()) {
                  return {
                    auxLinks: constraints[i]["auxiliaryLinks"],
                    auxNode: constraints[i]["auxiliaryNode"]
                  };
                }
              }
            } else {
              for (let k = 0; k < lT.length; k++) {
                for (let j = 0; j < cT.length; j++) {
                  if (lT[k].toLowerCase() === cT[j].toLowerCase()) {
                    return {
                      auxLinks: constraints[i]["auxiliaryLinks"],
                      auxNode: constraints[i]["auxiliaryNode"]
                    };
                  }
                }
              }
            }
          }
        }
      }
    }
    return false;
  }

  _splitAppliesOnTarget(link, constraints) {
    let compares = 0;
    let validCompares = 0;
    let applies = false;
    constraints.forEach(cons => {
      for (const name in cons) {
        if (cons.hasOwnProperty(name)) {
          //name is the datatype value

          if (name === "constraints" && cons[name] === "none") {
            // do nothing but tell that the validation suits the constraints;
            compares++;
            validCompares++;
          } else {
            // check for validation
            if (name === "type") {
              // check for type of the target node;
              //compare against an array of types

              const nodeTypesToApply = cons[name];
              nodeTypesToApply.forEach(t => {
                if (link.__target.isNodeOfType(t)) {
                  validCompares++;
                }
              });
              compares++;
            }
          }
        }
      }
      // found at least one definition that requests this merge;
      if (validCompares === compares) {
        applies = true;
        return applies;
      }
    });
    return applies;
  }

  __mapVerticesToNodes(model, dataArray) {
    // note no arrow function, otherwise model will not be updated(call by ref)

    dataArray.forEach(item => {
      const aNode = this._createNodeFromVertex(item);
      // set displayName to be a string! ;
      let langRep = LanguageTools.textInLanguage(aNode.__displayName);
      if (langRep === null || langRep === undefined) {
        if (validIRI(item.__vertexEdgeIdentifier)) {
          langRep = LanguageTools.IRI2Label(
            this.prefixMapperL2S,
            item.__vertexEdgeIdentifier
          );
        } else {
          console.error(
            "COULD NOT FIND A LABEL FOR VERTEX: " + item.__vertexEdgeIdentifier
          );
        }
      }
      aNode.__displayName = langRep;
      model.addNode(aNode);
    });

    // process Axioms;
  }

  _createNodeFromVertex = item => {
    const aNode = new Node();
    aNode.resourceReference = item;

    // create the mappings;
    const nMapper = this.definitionMap.nodeMapper;
    for (const name in nMapper) {
      if (nMapper.hasOwnProperty(name)) {
        // fetch data;
        const dataPath = nMapper[name];
        if (dataPath.indexOf(".") !== -1) {
          // need to perform nested getter;
          const tokens = dataPath.split(".");
          let dataItem = item;
          for (let i = 0; i < tokens.length; i++) {
            dataItem = dataItem[tokens[i]];
          }
          aNode[name] = dataItem;
        } else {
          // single data access in item
          aNode[name] = item[dataPath];
        }
      }
    }

    return aNode;
  };

  _createLinkFromEdge = item => {
    const aLink = new Link();
    aLink.resourceReference = item;

    // create the mappings;
    const mapper = this.definitionMap.linkMapper;
    for (const name in mapper) {
      if (mapper.hasOwnProperty(name) && name !== "mapAxiom") {
        // fetch data;
        const dataPath = mapper[name];
        if (dataPath.indexOf(".") !== -1) {
          // need to perform nested getter;
          const tokens = dataPath.split(".");
          let dataItem = item;
          for (let i = 0; i < tokens.length; i++) {
            dataItem = dataItem[tokens[i]];
          }
          aLink[name] = dataItem;
        } else {
          // single data access in item
          aLink[name] = item[dataPath];
        }
      }
    }

    // adjust display name
    // adjust link type if it is derived from axiomEdge
    if (aLink.__linkType === "axiomEdge") {
      aLink.__linkType = "axiomLink";
    }
    aLink.__displayName = LanguageTools.textInLanguage(aLink.__displayName);

    return aLink;
  };

  _mapEdgesToLinks(model, dataArray) {
    // note no arrow function, otherwise model will not be updated(call by ref)

    dataArray.forEach(item => {
      // check for axioms;

      const link = this._createLinkFromEdge(item);
      // provide src and tar;
      item.__sources.forEach(src => {
        // find node in model;
        const node = model.getNodeFromName(src.__vertexEdgeIdentifier);
        if (!link.__source) {
          link.__source = node;
        }
        node.addOutgoingLink(link);
      });
      item.__targets.forEach(src => {
        // find node in model;
        const node = model.getNodeFromName(src.__vertexEdgeIdentifier);
        if (!link.__target) {
          link.__target = node;
        }
        node.addOutgoingLink(link);
      });
      model.addLink(link);
    });
  }
}
