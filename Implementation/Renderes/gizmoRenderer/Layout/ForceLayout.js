import BaseLayoutComponent from "./BaseLayoutComponent";
import * as d3 from "d3";

export default class ForceLayout extends BaseLayoutComponent {
  constructor(graph) {
    super(graph);
    this.force = undefined;
    this.forceLinks = [];
    this.forceNodes = [];
    this.linkDistance = "auto";
    this.distanceValue = 300;
    this.layoutSize = [];
  }

  pauseForceLayoutAnimation = doPause => {
    if (doPause) {
      this.stopForce();
    } else {
      this.resumeForce();
    }
  };

  setLinkDistance(value) {
    this.distanceValue = value;
    if (this.force) {
      this.force.linkDistance(value);
    }
  }
  resumeForce() {
    if (this.force) {
      this.force.resume();
    }
  }
  stopForce() {
    if (this.force) {
      this.force.stop();
    }
  }
  toggleForce() {
    if (this.force) {
      if (this.force.alpha() === 0) {
        this.force.resume();
      } else {
        this.force.stop();
      }
    }
  }

  initializeLayoutEngine() {
    this.updateLayoutSize();
    this.renderedNodes = this.graph.nodes;
    this.renderedLinks = this.graph.links;
    if (this.force) {
      this.force.stop();
    }
    this.createForceElements();
    this.force.start();
  }

  updateLayoutSize() {
    const bb = this.graph.svgRoot.node().getBoundingClientRect();
    this.layoutSize[0] = bb.width;
    this.layoutSize[1] = bb.height;
  }

  recalculatePositions = () => {
    this.renderedNodes.forEach(node => {
      node.updateRenderingPosition();
    });
    this.renderedLinks.forEach(link => {
      link.updateRenderingPosition();
    });
  };

  createForceElements() {
    const that = this;
    if (this.force === undefined) {
      this.force = d3.layout.force();
    }

    this.forceLinks = [];
    this.forceNodes = [];
    let i;
    // for (i = 0; i < graph.propNodes.length; i++) {
    //   if (graph.propNodes[i].visible()) {
    //     // this is done when the property node it self is a force node >> it will return 2 links
    //     this.forceLinks = this.forceLinks.concat(
    //       graph.propNodes[i].getForceLink()
    //     );
    //   }
    // }

    // update force nodes based on visible flag
    for (i = 0; i < this.renderedNodes.length; i++) {
      if (this.renderedNodes[i].visible()) {
        this.forceNodes.push(this.renderedNodes[i]);
      }
    }

    for (i = 0; i < this.renderedLinks.length; i++) {
      if (this.renderedLinks[i].visible()) {
        this.forceLinks = this.forceLinks.concat(
          this.renderedLinks[i].getForceLink()
        );
        this.forceNodes = this.forceNodes.concat(
          this.renderedLinks[i].getForceNode()
        );
      }
    }

    this.force.nodes(this.forceNodes);
    this.force.links(this.forceLinks);

    // add reference to the layouthandler itself;
    this.forceNodes.forEach(node => {
      node.layoutHandlerReference = this;
    });

    this.forceLinks.forEach(link => {
      link.layoutHandlerReference = this;
    });

    this.distanceValue = 400;
    // create forceLinks;
    this.force
      .charge(-700)
      .linkDistance(this.computeLinkDistance) // just make sure that our links are not to long.
      .linkStrength(1)
      .size([that.layoutSize[0], that.layoutSize[1]])
      .gravity(0.025);

    this.force.on("tick", this.recalculatePositions);
  }

  computeLinkDistance(link) {
    if (link.type === "direct") {
      return 400;
    }
    if (link.type === "loop") {
      return 150;
    }
    if (link.type === "mlPart") {
      return 100;
    }
  }
} // end of class definition
