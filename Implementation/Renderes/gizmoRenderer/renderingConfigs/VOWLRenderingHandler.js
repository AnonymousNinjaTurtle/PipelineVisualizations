export default class DefaultRenderingHandler {
  constructor() {
    this.renderingConfigObject = {
      "owl:Thing": {
        style: {
          renderingType: "circle",
          bgColor: "#ffffff",
          strokeElement: true,
          strokeWidth: "1px",
          strokeStyle: "dashed",
          strokeColor: "#000",
          radius: 30,
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

      "owl:equivalentClass": {
        style: {
          renderingType: "circle",
          bgColor: "#aaccff",
          strokeElement: true,
          strokeWidth: "1px",
          strokeStyle: "dotted",
          strokeColor: "#000",
          radius: 50,
          width: 100,
          height: 50,
          doubleStrokes: true
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
      },

      "rdfs:Literal": {
        style: {
          renderingType: "rect",
          bgColor: "#FFCC33",
          strokeElement: true,
          strokeWidth: "1px",
          strokeStyle: "dashed",
          strokeColor: "#000",
          radius: 30,
          width: 50,
          height: 20
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

      "rdfs:subClassOf": {
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
            fillColor: "#000000"
          },

          propertyNode: {
            style: {
              renderingType: "rect",
              bgColor: "#ECF0F1",
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
          link_renderingType: "curve" // line or curve
        }
      }
    };

    this.defaultNodeCFG = {
      style: {
        renderingType: "circle",
        bgColor: "#800080",
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
        fontColor: "#4d88ad",
        fontSize: "22px"
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
    if (!this.renderingConfigObject.hasOwnProperty(type)) {
      console.log("NO DEFINITION FOR NODE TYPE:" + type);
      return this.defaultNodeCFG;
    }
    return this.renderingConfigObject[type];
  };

  getLinkConfigFromType = type => {
    if (!this.renderingConfigObject.hasOwnProperty(type)) {
      console.log("NO DEFINITION FOR LINK TYPE:" + type);

      return this.defaultLinkCFG;
    }
    return this.renderingConfigObject[type];
  };
}
