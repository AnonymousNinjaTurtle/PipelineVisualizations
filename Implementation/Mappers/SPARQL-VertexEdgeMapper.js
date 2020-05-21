// data handler is a base class;

import * as $CONST from "../Base/BaseComponentConstants";
import BaseComponent from "../Base/BaseComponent";
import VertexEdgeModel from "../Models/VertexEdgeModel";
import Vertex from "../Models/Vertex";
import Edge from "../Models/Edge";
import { validIRI } from "../Base/globalHelper";
export default class VertexEdgeMapper extends BaseComponent {
  constructor() {
    super();
    this.type = $CONST.TYPE_VERTEX_EDGE_MAPPER; // default type;

    this.requestedInputType = $CONST.TYPE_RESOURCE_RELATION_MODEL;
    this.hasCompatibleInput = false;

    this.definitionMap = {
      // mapping definitions; // defines the mapping from resource to vertex
      vertexMapper: {
        __vertexType: "_semanticType", // how do we handle multiple vertex type? << we dont node link model does!
        __vertexEdgeIdentifier: "__resourceIdentifier",
        __displayName: "_annotations.rdfs:label" // will fetch the full object with language defs! node link model gets prefLanguage tag
      },

      edgeMapper: {
        __edgeType: "_semanticType", // how do we handle multiple vertex type? << we dont node link model does!
        __vertexEdgeIdentifier: "__resourceIdentifier",
        __displayName: "__resourceIdentifier", // will fetch the full object with language defs! node link model gets prefLanguage tag
        __sources: "domains", // just renaming it
        __targets: "ranges" // just renaming it
      }
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

    const veModel = new VertexEdgeModel();
    veModel.setResourceIdentifier("__vertexEdgeIdentifier"); // lookup name

    this.__mapResourcesToVertex(veModel, modelData.resources);
    this.__mapRelationsToEdge(veModel, modelData.relations);
    this.resultObject.resultingModel = veModel;
  };

  __mapResourcesToVertex(model, dataArray) {
    // note no arrow function, otherwise model will not be updated(call by ref)
    dataArray.forEach(item => {
      const mappedVertex = this._createVertexFromResource(item);
      model.addVertex(mappedVertex);
    });

    // ------------------------AXIOMS HANDLING -----------------------"

    // get model Vertices;
    const vertexList = model.modelAsJsonObject.vertices;

    vertexList.forEach(vertex => {
      // check if vertex._annotations exists;
      if (
        vertex.resourceReference._axioms &&
        Object.keys(vertex.resourceReference._axioms).length > 0
      ) {
        const axiomsArray = vertex.resourceReference._axioms;

        for (const name in axiomsArray) {
          if (axiomsArray.hasOwnProperty(name)) {
            // this a particular axiom;
            const pAx = axiomsArray[name];
            pAx.forEach(axiom => {
              if (!model.vertexInMap(axiom)) {
                console.error(
                  "VERTEX DOES NOT EXIST IN THE MAP: TODO CREATE ONE! "
                );
              }
              const targetVertex = model.getVertexFromName(axiom);
              const axiomEdge = this.__createAxiomEdge(
                vertex,
                name,
                targetVertex
              );
              model.addEdge(axiomEdge);
            });
          }
        }
      }
    });
  }

  __createAxiomEdge(srcVertex, axiomName, targetVertex) {
    const anEdge = new Edge();
    anEdge.resourceReference = axiomName;
    anEdge.__edgeType = "axiomEdge";
    anEdge.__edgeAxiom = axiomName;
    anEdge.__vertexEdgeIdentifier =
      srcVertex.__vertexEdgeIdentifier +
      "$$" +
      axiomName +
      "$$" +
      targetVertex.__vertexEdgeIdentifier;
    anEdge.__displayName = axiomName;
    anEdge.__sources = [srcVertex];
    anEdge.__targets = [targetVertex];

    srcVertex.addOutgoingEdge(anEdge);
    targetVertex.addIncomingEdge(anEdge);

    return anEdge;
  }

  _createVertexFromResource = item => {
    const aVertex = new Vertex();
    aVertex.resourceReference = item;

    // create the mappings;
    const vMapper = this.definitionMap.vertexMapper;
    for (const name in vMapper) {
      if (vMapper.hasOwnProperty(name)) {
        // fetch data;
        const dataPath = vMapper[name];
        if (dataPath.indexOf(".") !== -1) {
          // need to perform nested getter;
          const tokens = dataPath.split(".");
          let dataItem = item;
          for (let i = 0; i < tokens.length; i++) {
            dataItem = dataItem[tokens[i]];
          }
          aVertex[name] = dataItem;
        } else {
          // single data access in item
          aVertex[name] = item[dataPath];
        }
      }
    }
    return aVertex;
  };

  __mapRelationsToEdge(model, dataArray) {
    // note no arrow function, otherwise model will not be updated(call by ref)
    dataArray.forEach(item => {
      const mappedEdge = this._createEdgeFromRelation(item);
      // add some magic;
      for (let i = 0; i < mappedEdge.__sources.length; i++) {
        const src = mappedEdge.__sources[i];
        const vertex = model.getVertexFromName(src);

        if (vertex) {
          mappedEdge.__sources[i] = vertex;
          vertex.addOutgoingEdge(mappedEdge);
        }
      }
      for (let i = 0; i < mappedEdge.__targets.length; i++) {
        const tar = mappedEdge.__targets[i];
        const vertex = model.getVertexFromName(tar);

        if (vertex) {
          mappedEdge.__targets[i] = vertex;
          vertex.addIncomingEdge(mappedEdge);
        } else {
          if (
            model.getVertexFromName(
              mappedEdge.__vertexEdgeIdentifier + "$$" + tar
            )
          ) {
            const tempVertex = model.getVertexFromName(
              mappedEdge.__vertexEdgeIdentifier + "$$" + tar
            );
            mappedEdge.__targets[i] = tempVertex;
            tempVertex.addIncomingEdge(mappedEdge);
          } else {
            console.error("NO VERTEX FOUND FOR NAME " + tar);
            // create one !
            const aVertex = new Vertex();
            aVertex.resourceReference = tar;
            if (validIRI(tar)) {
              // create the id for this vertex;
              aVertex.__vertexEdgeIdentifier = tar;
            } else {
              aVertex.__vertexType = "Literal";
              // its id is the full tripple;
              aVertex.__vertexEdgeIdentifier =
                mappedEdge.__vertexEdgeIdentifier + "$$" + tar;
              aVertex.__displayName = tar; // this is the literal value of something we have not identified
            }
            // we assume that all resources are created (the ones which could be created)
            // otherwise we point on a literal or a resource that has not been created>> means external resource or
            // not jet read any information about that;
            aVertex.addIncomingEdge(mappedEdge);
            model.addVertex(aVertex);
            mappedEdge.__targets[i] = aVertex;
          }
        }
      }
      model.addEdge(mappedEdge);
      // duplicate for multiple domain and ranges; // needed for sparql stuff;

      if (
        mappedEdge.__sources.length === 1 &&
        mappedEdge.__targets.length > 1
      ) {
        // clone the edge and set the target to the new element;
        for (let i = 1; i < mappedEdge.__targets.length; i++) {
          const clonedEdge = new Edge();
          for (const name in mappedEdge) {
            if (mappedEdge.hasOwnProperty(name)) {
              clonedEdge[name] = mappedEdge[name];
            }
          }

          const newTarget = clonedEdge.__targets[i];
          clonedEdge.__targets = [newTarget];
          clonedEdge.__vertexEdgeIdentifier += "$$ClonedEdge" + i;
          newTarget.addIncomingEdge(clonedEdge);
          model.addEdge(clonedEdge);
        }
      }
    });
  }

  _createEdgeFromRelation = item => {
    const anEdge = new Edge();
    anEdge.resourceReference = item;

    // create based on the mapping def;
    const eMapper = this.definitionMap.edgeMapper;
    for (const name in eMapper) {
      if (eMapper.hasOwnProperty(name)) {
        // fetch data;
        const dataPath = eMapper[name];
        if (dataPath.indexOf(".") !== -1) {
          // need to perform nested getter;
          const tokens = dataPath.split(".");
          let dataItem = item;
          for (let i = 0; i < tokens.length; i++) {
            dataItem = dataItem[tokens[i]];
          }
          anEdge[name] = dataItem;
        } else {
          // single data access in item
          anEdge[name] = item[dataPath];
        }
      }
    }
    return anEdge;
  };
}
