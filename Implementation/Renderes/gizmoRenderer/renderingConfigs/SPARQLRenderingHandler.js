export default class DefaultRenderingHandler {
  constructor() {
    this.renderingConfigObject = {
      nodes: {
        "owl:Class": {
          style: {
            renderingType: "circle",
            bgColor: "#aaccff",
            strokeElement: true,
            strokeWidth: "1px",
            strokeStyle: "solid",
            strokeColor: "#000",
            radius: 50,
            width: 100,
            height: 50
          },
          fontStyle: {
            fontFamily: "Helvetica,Arial,sans-serif",
            fontColor: "#000",
            fontSize: "12px"
          },

          options: {
            drawDisplayName: true,
            drawNestedAttributes: false,
            cropLongText: false,
            addTitleForDisplayName: true,
            overwritesShapeSize: false,
            overwriteOffset: 0,
            fontPositionH: "center",
            fontPositionV: "center"
          }
        },

        Literal: {
          style: {
            renderingType: "rect",
            bgColor: "#FFCC33",
            strokeElement: true,
            strokeWidth: "1px",
            strokeStyle: "solid",
            strokeColor: "#000",
            radius: 30,
            width: 100,
            height: 25
          },
          fontStyle: {
            fontFamily: "Helvetica,Arial,sans-serif",
            fontColor: "#000",
            fontSize: "12px"
          },

          options: {
            drawDisplayName: true,
            drawNestedAttributes: false,
            cropLongText: true,
            addTitleForDisplayName: true,
            overwritesShapeSize: false,
            overwriteOffset: 0,
            fontPositionH: "center",
            fontPositionV: "center"
          }
        }
      },
      links: {
        "owl:datatypeProperty": {
          style: {
            link: {
              lineStyle: "solid",
              lineWidth: "2px",
              lineColor: "#000000"
            },
            arrowHead: {
              renderingType: "triangle",
              scaleFactor: 1,
              strokeWidth: "2px",
              strokeStyle: "solid",
              strokeColor: "#000000",
              fillColor: "#000000"
            },

            propertyNode: {
              style: {
                renderingType: "rect",
                bgColor: "#99CC66",
                roundedCorner: "0,0",
                fontSizeOverWritesShapeSize: "true",
                overWriteOffset: "5",
                strokeElement: "false",
                radius: 50,
                width: 100,
                height: 25
              },
              fontStyle: {
                fontFamily: "Helvetica,Arial,sans-serif",
                fontColor: "#000000",
                fontSize: "12px"
              },
              options: {
                drawDisplayName: true,
                cropLongText: true,
                addTitleForDisplayName: true,
                overwritesShapeSize: false,
                overwriteOffset: 0,
                fontPositionH: "center",
                fontPositionV: "center"
              }
            }
          },
          options: {
            drawPropertyNode: true,
            drawArrowHead: true,
            drawArrowTail: false,
            link_renderingType: "line" // line or curve
          }
        },

        "owl:objectProperty": {
          style: {
            link: {
              lineStyle: "solid",
              lineWidth: "2px",
              lineColor: "#000000"
            },
            arrowHead: {
              renderingType: "triangle",
              scaleFactor: 1,
              strokeWidth: "2px",
              strokeStyle: "solid",
              strokeColor: "#000000",
              fillColor: "#000000"
            },

            propertyNode: {
              style: {
                renderingType: "rect",
                bgColor: "#aaccff",
                roundedCorner: "0,0",
                fontSizeOverWritesShapeSize: "true",
                overWriteOffset: "5",
                strokeElement: "false",
                radius: 50,
                width: 100,
                height: 25
              },
              fontStyle: {
                fontFamily: "Helvetica,Arial,sans-serif",
                fontColor: "#000000",
                fontSize: "12px"
              },
              options: {
                drawDisplayName: true,
                cropLongText: true,
                addTitleForDisplayName: true,
                overwritesShapeSize: false,
                overwriteOffset: 0,
                fontPositionH: "center",
                fontPositionV: "center"
              }
            }
          },
          options: {
            drawPropertyNode: true,
            drawArrowHead: true,
            drawArrowTail: false,
            link_renderingType: "line" // line or curve
          }
        }
      }
    };

    this.defaultNodeCFG = {
      style: {
        renderingType: "rect",
        bgColor: "#ffffff",
        strokeElement: true,
        strokeWidth: "1px",
        strokeStyle: "solid",
        strokeColor: "#000",
        radius: 50,
        width: 100,
        height: 50,
        roundedCorner: "10,10"
      },
      fontStyle: {
        fontFamily: "Helvetica,Arial,sans-serif",
        fontColor: "#000",
        fontSize: "12px"
      },

      options: {
        drawDisplayName: true,
        drawNestedAttributes: true,
        cropLongText: false,
        addTitleForDisplayName: true,
        overwritesShapeSize: false,
        overwriteOffset: 0,
        fontPositionH: "center",
        fontPositionV: "center"
      }
    };

    this.defaultLinkCFG = {
      style: {
        link: {
          lineStyle: "dashed",
          lineWidth: "2px",
          lineColor: "#000000"
        },
        arrowHead: {
          renderingType: "triangle",
          scaleFactor: 1,
          strokeWidth: "2px",
          strokeStyle: "solid",
          strokeColor: "#000000",
          fillColor: "#45c3d6"
        },
        arrowTail: {
          renderingType: "diamond",
          scaleFactor: 2,
          strokeWidth: "2px",
          strokeStyle: "solid",
          strokeColor: "#d58d88",
          fillColor: "#d6d5d5"
        },
        propertyNode: {
          style: {
            renderingType: "rect",
            bgColor: "#aaccff",
            roundedCorner: "0,0",
            fontSizeOverWritesShapeSize: "true",
            overWriteOffset: "5",
            strokeElement: "false",
            radius: 50,
            width: 100,
            height: 25
          },
          fontStyle: {
            fontFamily: "Helvetica,Arial,sans-serif",
            fontColor: "#000000",
            fontSize: "22px"
          },
          options: {
            drawDisplayName: true,
            cropLongText: true,
            addTitleForDisplayName: true,
            overwritesShapeSize: false,
            overwriteOffset: 0,
            fontPositionH: "center",
            fontPositionV: "center"
          }
        }
      },
      options: {
        drawPropertyNode: true,
        drawArrowHead: true,
        drawArrowTail: false,
        link_renderingType: "line" // line or curve
      }
    };
  }
  getNodeConfigFromType = type => {
    if (!this.renderingConfigObject.nodes.hasOwnProperty(type)) {
      console.log("NO DEFINITION FOR NODE TYPE:" + type);
      return this.defaultNodeCFG;
    }
    return this.renderingConfigObject.nodes[type];
  };

  getLinkConfigFromType = type => {
   
    if (!this.renderingConfigObject.links.hasOwnProperty(type)) {
      console.log("NO DEFINITION FOR LINK TYPE:" + type);

      return this.defaultLinkCFG;
    }
    return this.renderingConfigObject.links[type];
  };
}
