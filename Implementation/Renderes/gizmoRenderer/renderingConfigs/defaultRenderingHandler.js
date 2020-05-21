export default class DefaultRenderingHandler {
  constructor() {
    this.renderingConfigObject = {};

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
