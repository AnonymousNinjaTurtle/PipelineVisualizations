import * as d3 from "d3";

export default class LinkInteractions {
  constructor(graph) {
    this.graphObject = graph;
    this.dragBehaviour = null;
    this.hasNodeClick = false;
    this.hasNodeDobleClick = false;
    this.hasLinkHover = true;
    this.hasPropertyHover = true;
  }

  applyLinkInteractions = () => {
    if (!this.graphObject) {
      console.error("NO GRAPH OBJECT FOUND");
      return;
    }

    // Drag,
    this.dragBehaviour = d3.behavior
      .drag()
      .origin(function(d) {
        return d;
      })
      .on("dragstart", this.dragStart)
      .on("drag", this.drag)
      .on("dragend", this.dragEnd);

    /** DEFINING OWN INTERNAL HOVER BEHAVIOR -- DO NOT OVERWRITE **/
    const that = this;
    this.hoverBehaviour = function(d) {
      if (that.hasLinkHover) {
        d.on("mouseover", that.linkHoverIn);
        d.on("mouseout", that.linkHoverOut);
      }
    };
    this.propertyHoverBehaviour = function(d) {
      if (that.hasPropertyHover) {
        d.on("mouseover", that.propertyHoverIn);
        d.on("mouseout", that.propertyHoverOut);
      }
    };

    // /** DEFINING OWN INTERNAL CLICK BEHAVIOR -- DO NOT OVERWRITE **/
    // this.clickBehaviour = function(d) {
    //   if (that.hasNodeClick) {
    //     d.on('click', that.nodeClick);
    //   }
    // };
    // this.doubleClickBehavoir = function(d) {
    //   if (that.hasNodeDobleClick) {
    //     d.on('click', that.nodeDoubleClick);
    //   }
    // };

    // apply the node behavoir on the nodes;
    const links = this.graphObject.links;
    if (links.length > 0) {
      links.forEach(l => {
        if (l.groupRoot) {
          l.groupRoot.call(this.hoverBehaviour);
          // try to get the parentOf shape;
          if (l.renderingShape) {
            const parentNode = l.renderingShape.node().parentNode;
            if (parentNode) {
              const shapeRoot = d3.select(parentNode);
              if (shapeRoot) {
                shapeRoot.call(this.propertyHoverBehaviour);
                shapeRoot.call(this.dragBehaviour);
              }
            }
          }
        }
      });
    }

    // Hover
    // Click
    // DoubleClick
  };

  linkHoverIn(d) {
    const shape = d.renderingLine;
    shape.style("stroke", "red");
  }

  linkHoverOut(d) {
    const shape = d.renderingLine;
    shape.style("stroke", d.renderingConfig().style.link.lineColor);
  }

  propertyHoverIn = d => {
    const shape = d.ref.renderingShape;
    shape.style("fill", "red");
    const that = this;
    if (d.mouseEntered === true) {
      return;
    }
    d.mouseEntered = true;
    d.keepRendering = true;

    if (d.unblockRendering) {
      d.keepRendering = false;
      d.unblockRendering = false;
    }

    // Testing internal types hovers
    // if (d.ref.__internalType === "multiLink") {
    //   const radius = 20;
    //   const aBtn = d.groupRoot.append("g");
    //   aBtn.classed("MultiLinkHoverButton", true);
    //   // draw a button top left;
    //   const targetPrimitive = aBtn.append("circle");
    //   targetPrimitive.attr("r", radius);
    //   targetPrimitive.attr("cx", 50);
    //   targetPrimitive.attr("cy", -10);
    //   targetPrimitive.style("fill", "#ccc");
    //
    //   targetPrimitive.on("mouseover", function(d) {
    //     that.propertyHoverIn(d);
    //     targetPrimitive.style("fill", "red");
    //   });
    //   targetPrimitive.on("mouseout", function(d) {
    //     targetPrimitive.style("fill", "#444");
    //   });
    //   targetPrimitive.on("click", function(d) {
    //     console.log("THAT BUTTON WAS CLICKED!");
    //     console.log(that.graphObject); // we could emit stuff;
    //   });
    // }
  };

  propertyHoverOut(d) {
    const shape = d.ref.renderingShape;
    shape.style("fill", d.ref.renderingConfig().style.propertyNode.bgColor);
    if (d.ref.__internalType === "multiLink") {
      d3.selectAll(".MultiLinkHoverButton").remove();
    }
    d.mouseEntered = false;
  }

  nodeDoubleClick(d) {
    // add Handlers
  }
  nodeClick(d) {
    // add handers; >> this is where we want to overwrite something;
  }

  // split the dragger functions for better reuse;
  dragStart = d => {
    d3.event.sourceEvent.stopPropagation(); // Prevent panning
    d.fixed = true;
    d.groupRoot.style("cursor", "pointer");
  };

  drag = d => {
    d3.event.sourceEvent.stopPropagation(); // Prevent panning
    d.setPosition(d3.event.x, d3.event.y);
    d.px = d3.event.x;
    d.py = d3.event.y;
    d.ref.updateRenderingPosition();
    if (d.layoutHandlerReference && d.layoutHandlerReference.force) {
      d.layoutHandlerReference.resumeForce();
    }
  };

  dragEnd = d => {
    d.fixed = false;
    d.groupRoot.style("cursor", "auto");
  };
}
