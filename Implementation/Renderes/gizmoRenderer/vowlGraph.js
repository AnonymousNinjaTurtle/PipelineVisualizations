import GraphRenderer from "./graph";
import Interactions from "./Interactions/interactions";
export default class VOWLRenderer extends GraphRenderer {
  constructor() {
    super();
    this.GRAPH_TYPE = "VOWL_RENDERING_TYPE";

    this.layoutHandler = null;
    this.renderingConfig = null;
    this.interactionHandler = new Interactions();
  }

  /** Exposed functions >> DO NOT OVERWRITE **/

  createRenderingElements() {
    super.createRenderingElements();
    
    this.model.nodes.forEach(node => {
      this.createNodePrimitive(node);
    });
    // set the position of the test nodes;

    this.nodes[0].setPosition(60, 150);
    this.nodes[1].setPosition(300, 150);

    this.model.links.forEach(link => {
      this.createLinkPrimitive(link);
    });

    let i = 0;
    this.links.forEach(link => {
      this.updateMultiLinkTypes(link);
      link.setPosition(200, i * 50);
      i++;
    });

    // TODO SAME FOR LINKS!;
  }
}
