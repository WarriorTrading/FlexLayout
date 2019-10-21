import * as React from "react";
import * as ReactDOM from "react-dom";
import { I18nLabel } from "..";
import Actions from "../model/Actions";
import TabNode from "../model/TabNode";
import TabSetNode from "../model/TabSetNode";
import Rect from "../Rect";
import TitleApis from "../titleApis";
import Layout from "./Layout";

/** @hidden @internal */
export interface ITabButtonProps {
  layout: Layout;
  node: TabNode;
  show: boolean;
  selected: boolean;
  height: number;
}

/** @hidden @internal */
// tslint:disable-next-line: variable-name
export const TabButton = (props: ITabButtonProps) => {
  const { layout, show, height, node, selected } = props;
  const [editing, setEditing] = React.useState(false);
  const selfRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLInputElement | null>(null);

  const updateRect = React.useCallback(() => {
    // record position of tab in node
    const clientRect = (ReactDOM.findDOMNode(
      layout
    ) as Element).getBoundingClientRect();
    const r = selfRef!.current!.getBoundingClientRect();
    node._setTabRect(
      new Rect(
        r.left - clientRect.left,
        r.top - clientRect.top,
        r.width,
        r.height
      )
    );
  }, [node, layout]);
  React.useLayoutEffect(() => {
    updateRect();
  });

  const cm = React.useMemo(() => layout.getClassName, [layout.getClassName]);

  const classNames = React.useMemo(() => {
    // tslint:disable-next-line: no-shadowed-variable
    let classNames = cm("flexlayout__tab_button", node);
    if (selected) {
      classNames += " " + cm("flexlayout__tab_button--selected", node);
    } else {
      classNames += " " + cm("flexlayout__tab_button--unselected", node);
    }
    if (node.getClassName() !== undefined) {
      classNames += " " + node.getClassName();
    }
    return classNames;
  }, [node, cm, selected]);

  const onEndEdit = React.useCallback(
    (event: Event) => {
      if (event.target !== contentRef.current) {
        setEditing(false);
        document.body.removeEventListener("mousedown", onEndEdit);
        document.body.removeEventListener("touchstart", onEndEdit);
      }
    },
    [contentRef]
  );

  const onClick = React.useCallback(
    (event: Event) => {
      layout.doAction(Actions.selectTab(node.getId()));
    },
    [layout, node]
  );

  const onDoubleClick = (event: Event) => {
    if (node.isEnableRename()) {
      setEditing(true);
      document.body.addEventListener("mousedown", onEndEdit);
      document.body.addEventListener("touchstart", onEndEdit);
    } else {
      const parentNode = node.getParent() as TabSetNode;
      if (parentNode.isEnableMaximize()) {
        layout.maximize(parentNode);
      }
    }
  };

  const onMouseDown = React.useCallback(
    (
      event:
        | React.MouseEvent<HTMLDivElement, MouseEvent>
        | React.TouchEvent<HTMLDivElement>
    ) => {
      const message = layout.i18nName(I18nLabel.Move_Tab, node.getName());
      layout.dragStart(
        event,
        message,
        node,
        node.isEnableDrag(),
        onClick,
        onDoubleClick
      );
    },
    [layout, node, onClick, onDoubleClick]
  );

  const leadingContent = React.useMemo(() => {
    if (node.getIcon() !== undefined) {
      return <img src={node.getIcon()} alt="leadingContent" />;
    } else {
      return null;
    }
  }, [node]);

  const renderState = React.useMemo(() => {
    // tslint:disable-next-line: no-shadowed-variable
    const renderState = {
      leading: leadingContent,
      content: node.getName()
    };
    layout.customizeTab(node, renderState);
    return renderState;
  }, [layout, leadingContent, node]);

  const onTextBoxKeyPress = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.keyCode === 27) {
        // esc
        setEditing(false);
      } else if (event.keyCode === 13) {
        // enter
        setEditing(false);
        layout.doAction(
          Actions.renameTab(
            node.getId(),
            (event.target as HTMLInputElement).value
          )
        );
      }
    },
    [node, layout]
  );

  const onTextBoxMouseDown = React.useCallback(
    (
      event:
        | React.MouseEvent<HTMLInputElement>
        | React.TouchEvent<HTMLInputElement>
    ) => {
      event.stopPropagation();
    },
    []
  );

  const onClose = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      layout.doAction(Actions.deleteTab(node.getId()));
    },
    []
  );

  const onCloseMouseDown = React.useCallback(
    (
      event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      event.stopPropagation();
    },
    []
  );

  return (
    <div
      ref={selfRef}
      style={{
        visibility: show ? "visible" : "hidden",
        height
      }}
      className={classNames}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
    >
      <Leading cm={cm} node={node} renderState={renderState} />
      <Content
        ref={contentRef}
        editing={editing}
        cm={cm}
        onTextBoxKeyPress={onTextBoxKeyPress}
        onTextBoxMouseDown={onTextBoxMouseDown}
        renderState={renderState}
        node={node}
      />
      <CloseButton
        isEnableClose={node.isEnableClose()}
        cm={cm}
        node={node}
        onClose={onClose}
        onCloseMouseDown={onCloseMouseDown}
      />
    </div>
  );
};

// tslint:disable-next-line: variable-name
const Leading = (props: {
  cm: any;
  node: any;
  renderState: {
    leading: JSX.Element | null;
    content: string;
  };
}) => {
  const { cm, node, renderState } = props;
  return (
    <div className={cm("flexlayout__tab_button_leading", node)}>
      {renderState.leading}
    </div>
  );
};



// tslint:disable-next-line: variable-name
const Content = React.forwardRef<
  HTMLInputElement | HTMLDivElement | null,
  {
    editing: boolean;
    cm: any;
    onTextBoxKeyPress: any;
    onTextBoxMouseDown: any;
    renderState: {
      leading: JSX.Element | null;
      content: string;
    };
    node: any;
  }
>((props, ref) => {
  const {
    editing,
    cm,
    node,
    onTextBoxKeyPress,
    onTextBoxMouseDown,
  } = props;

  const nodeId = React.useMemo(() => node.getId(), [node]);
  const contentRef = React.useRef<HTMLInputElement | null>(null);
  React.useImperativeHandle(ref, () => contentRef.current);
  const contentStyle = React.useMemo(() => {
    if (contentRef.current == null || !editing) {
      return {
        width: 0
      };
    }
    return {
      width: contentRef.current.getBoundingClientRect().width
    };
  }, [editing, contentRef]);
  const [title, setTitle] = React.useState("Hello world");

  React.useEffect(() => {
    let currentTitle: string = "";
    const unsubscribe = TitleApis.subscribe(
      (payload) => {
        if (nodeId === payload.nodeId && currentTitle !== payload.title) {
          currentTitle = payload.title;
          setTitle(currentTitle);
        }
      }
    );

    return () => {
      unsubscribe();
    }; 
  }, [nodeId]);
  return (
    <React.Fragment>
      {editing ? (
        <input
          style={contentStyle}
          ref={contentRef}
          className={cm("flexlayout__tab_button_textbox")}
          type="text"
          autoFocus={true}
          defaultValue={node.getName()}
          onKeyDown={onTextBoxKeyPress}
          onMouseDown={onTextBoxMouseDown}
          onTouchStart={onTextBoxMouseDown}
        />
      ) : (
        <div ref={contentRef} className={cm("flexlayout__tab_button_content")}>
          {title}
        </div>
      )}
    </React.Fragment>
  );
});

// tslint:disable-next-line: variable-name
const CloseButton = (props: {
  isEnableClose: boolean;
  cm: any;
  node: any;
  onCloseMouseDown: any;
  onClose: any;
}) => {
  const { isEnableClose, cm, node, onCloseMouseDown, onClose } = props;
  return isEnableClose ? (
    <div
      className={cm("flexlayout__tab_button_trailing", node)}
      onMouseDown={onCloseMouseDown}
      onClick={onClose}
      onTouchStart={onCloseMouseDown}
    />
  ) : null;
};
