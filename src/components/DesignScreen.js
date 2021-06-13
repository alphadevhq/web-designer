import React, { useContext, useEffect, useState } from "react";
import uuid from "react-uuid";
import { GlobPreference } from "../App";
import {
  getBody,
  getCssStyles,
  getDesign,
  getOffset,
  setDesignElement,
  updateDesign,
} from "../utils/common";

import css from "css";

function DesignScreen() {
  const context = useContext(GlobPreference);
  const [zoomValue, setzoomValue] = useState(100);
  const { is_css_editor_on, set_is_css_editor_on, setrefresh, refresh } =
    context;

  useEffect(() => {
    window.body.className = window.body.className || "designRoot";
    var viewport = document.createElement("meta");
    viewport.setAttribute("name", "viewport");
    viewport.setAttribute("content", "width=device-width");

    var StylesDom = document.createElement("style");

    StylesDom.innerText = getCssStyles(window.body, "", "styles");

    StylesDom.innerText +=
      "@media screen and (max-width: 1025px) {" +
      getCssStyles(window.body, "", "tabletStyles") +
      "}";

    StylesDom.innerText +=
      "@media screen and (max-width: 415px) {" +
      getCssStyles(window.body, "", "mobileStyles") +
      "}";

    var x = document.getElementById("designRoot");

    //   x.contentWindow.addEventListener("wheel", wheelScrollHandler, {
    //     passive: false,
    //   });
    //   x.contentDocument.addEventListener("wheel", wheelScrollHandler, {
    //     passive: false,
    //   });

    var iframe = x.contentWindow || x.contentDocument;
    if (iframe.document) iframe = iframe.document;

    setDesignElement(getBody()._id, iframe.body);

    iframe.body.innerText = null;
    iframe.head.innerText = null;
    iframe.head.appendChild(viewport);
    iframe.head.appendChild(StylesDom);
    updateDesign(window.body, iframe.body, context.sethashmap);
    iframe.body.classList.add(window.body.className);
  }, [context.refresh]);

  //   hashMap.setDesignDom(body, iframe.body);
  const [overlay_style, setoverlay_style] = useState({});
  const [inner_overlay_style, setinner_overlay_style] = useState({});

  useEffect(() => {
    if (!context.hashmap.overlay_id) {
      setoverlay_style((s) => {
        return {
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
        };
      });
      setinner_overlay_style({ left: "0px", top: "0px" });
      return;
    }

    var designElement = getDesign(context.hashmap.overlay_id);

    var allStyles = window.getComputedStyle(designElement);

    // console.log(getOffset(designElement).left);

    setinner_overlay_style({
      width: designElement.offsetWidth,
      height: designElement.offsetHeight,
    });
    // console.log(overlay.tagName);
    if (designElement.tagName === "BODY") {
      setoverlay_style((s) => {
        return {
          ...s,
          left: getOffset(designElement).left,
          top: getOffset(designElement).top,
        };
      });
    } else {
      setoverlay_style((s) => {
        return {
          ...s,
          left: getOffset(designElement).left - parseInt(allStyles.marginLeft),
          top: getOffset(designElement).top - parseInt(allStyles.marginTop),
        };
      });
    }

    setoverlay_style((s) => {
      return {
        ...s,
        paddingLeft: allStyles.marginLeft,
        paddingTop: allStyles.marginTop,
        paddingRight: allStyles.marginRight,
        paddingBottom: allStyles.marginBottom,
      };
    });
  }, [context.hashmap.overlay_id]);

  return (
    <div className="design-wrapper">
      <div className="design-container">
        {/* <!-- Screen Sizes Buttons Bar Start --> */}
        <div className="screen-size-bar">
          <div className="screen-size-bar-inner">
            {[
              { screen: "desktop", label: "desktop(1920×1080)" },
              { screen: "tablet", label: "tablet(1024×1366)" },
              { screen: "mobile", label: "mobile(414×736)" },
            ].map((item, index) => {
              return (
                <span
                  className={
                    context.hashmap.screen_class === item.screen ? "active" : ""
                  }
                  onClick={(e) => {
                    context.sethashmap((s) => {
                      return {
                        ...s,
                        screen_class: item.screen,
                      };
                    });
                  }}
                >
                  {item.label}
                </span>
              );
            })}
          </div>

          <div className="screen-size-bar-inner">
            <span
              onClick={(e) => set_is_css_editor_on("single")}
              className={is_css_editor_on == "single" ? "active" : ""}
            >
              Css Editor
            </span>
            <span
              onClick={(e) => set_is_css_editor_on("all")}
              className={is_css_editor_on == "all" ? "active" : ""}
            >
              View Css
            </span>
          </div>
        </div>
        {/* <!-- Screen Sizes Buttons Bar End --> */}

        <div className="design-wrapper cursor-screen">
          <div
            className={"design-outer " + context.hashmap.screen_class}
            style={{ transform: "scale(" + (zoomValue / 100).toFixed(2) + ")" }}
          >
            {/* <!-- overlay that show elements on design screen --> */}
            <div id="overlay" style={overlay_style}>
              <span style={inner_overlay_style}></span>
            </div>

            {/* <!-- iframe that shows live-design --> */}
            <iframe
              className="design-inner"
              src=""
              id="designRoot"
              frameBorder="0"
              title="design"
            ></iframe>
          </div>
        </div>
        <div className="bottom-bar">
          <div className="zoom-bar">
            <i
              className="fas fa-plus"
              id="zoom-plus"
              onClick={(e) => {
                setzoomValue(zoomValue + 10);
              }}
            ></i>
            <i
              className="fas fa-minus"
              id="zoom-minus"
              onClick={(e) => {
                setzoomValue(zoomValue - 10);
              }}
            ></i>
            <div>
              <span id="zoom-status">{zoomValue}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignScreen;