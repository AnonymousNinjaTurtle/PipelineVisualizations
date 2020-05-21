import BasePrimitive from "./BasePrimitive";

export default class LinkPrimitive extends BasePrimitive {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.sourceNode = null;
    this.targetNode = null;
    this.__internalType = "singleLink";
  }

  setInternalType(type) {
    this.__internalType = type;
    // type can be loop, singleLink, multiLink ;
  }

  setTargetNode(node) {
    this.targetNode = node;
    node.addIncomingLink(this);
  }
  setSourceNode(node) {
    this.sourceNode = node;
    node.addOutgoingLink(this);
  }

  setPosition = (x, y) => {
    this.x = x;
    this.y = y;
  };

  getForceNode() {
    if (this.__internalType === "loop" || this.__internalType === "multiLink") {
      // get the data for the force node;
      const nodeForForce = this.renderingShape.data();
      return nodeForForce;
    }
    return []; // empty array
  }

  getForceLink() {
    if (this.__internalType === "loop") {
      return [
        {
          source: this.sourceNode,
          target: this.renderingShape.data()[0],
          type: "loop"
        }
      ];
    }
    if (this.__internalType === "multiLink") {
      return [
        {
          source: this.sourceNode,
          target: this.renderingShape.data()[0],
          type: "mlPart"
        },
        {
          source: this.renderingShape.data()[0],
          target: this.targetNode,
          type: "mlPart"
        }
      ];
    }

    return [
      {
        source: this.sourceNode,
        target: this.targetNode,
        type: "direct"
      }
    ];
  }

  updateRenderingPosition = () => {
    // based on config; choose attribute selector;
    if (this.renderingLine) {
      // set its attributes based on the source and target nodes;
      this.drawTools().updateLinePosition(
        this,
        this.renderingLine,
        this.sourceNode,
        this.targetNode,
        this.__internalType,
        this.renderingConfig().options.link_renderingType === "curve"
      );

      this.drawTools().updatePropertyPosition(
        this,
        this.renderingShape,
        this.sourceNode,
        this.targetNode,
        this.__internalType,
        this.renderingConfig().options.link_renderingType === "curve"
      );
    }
  };

  // this one will get the draw Functions replacement!
  render = (groupRoot, propertyContainer, arrowContainer) => {
    this.groupRoot = groupRoot;
    this.propertyContainer = propertyContainer;
    this.arrowContainer = arrowContainer;

    // handle rendering based on the config;
    const renderingElements = this.drawTools().renderLink(
      this.groupRoot,
      this.propertyContainer,
      this.arrowContainer,
      this.renderingConfig(),
      this
    );
    this.renderingLine = renderingElements.renderingLine;
    this.renderingShape = renderingElements.renderingShape;
    this.renderingText = renderingElements.renderingText;
    this.updateRenderingPosition();
  };
}
