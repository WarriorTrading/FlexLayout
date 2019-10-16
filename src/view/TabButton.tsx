import * as React from "react";
import * as ReactDOM from "react-dom";
import { I18nLabel } from "..";
import Actions from "../model/Actions";
import TabNode from "../model/TabNode";
import TabSetNode from "../model/TabSetNode";
import Rect from "../Rect";
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
export class TabButton extends React.Component<ITabButtonProps, any> {
  selfRef?: HTMLDivElement;

  contentWidth: number = 0;
  contentRef?: Element;

  constructor(props: ITabButtonProps) {
    super(props);
    this.state = { editing: false };
    this.onEndEdit = this.onEndEdit;
  }

  onMouseDown = (
    event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>
  ) => {
    const message = this.props.layout.i18nName(
      I18nLabel.Move_Tab,
      this.props.node.getName()
    );
    this.props.layout.dragStart(
      event,
      message,
      this.props.node,
      this.props.node.isEnableDrag(),
      this.onClick,
      this.onDoubleClick
    );
  }

  onClick = (event: Event) => {
    const node = this.props.node;
    this.props.layout.doAction(Actions.selectTab(node.getId()));
  }

  onDoubleClick = (event: Event) => {
    if (this.props.node.isEnableRename()) {
      this.setState({ editing: true });
      document.body.addEventListener("mousedown", this.onEndEdit);
      document.body.addEventListener("touchstart", this.onEndEdit);
    } else {
      const parentNode = this.props.node.getParent() as TabSetNode;
      if (parentNode.isEnableMaximize()) {
        this.props.layout.maximize(parentNode);
      }
    }
  }

  onEndEdit = (event: Event) => {
    if (event.target !== this.contentRef) {
      this.setState({ editing: false });
      document.body.removeEventListener("mousedown", this.onEndEdit);
      document.body.removeEventListener("touchstart", this.onEndEdit);
    }
  }

  onClose = (event: React.MouseEvent<HTMLDivElement>) => {
    const node = this.props.node;
    this.props.layout.doAction(Actions.deleteTab(node.getId()));
  }

  onCloseMouseDown = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
  }

  componentDidMount() {
    this.updateRect();
  }

  componentDidUpdate() {
    this.updateRect();
    if (this.state.editing) {
      (this.contentRef as HTMLInputElement).select();
    }
  }

  updateRect() {
    // record position of tab in node
    const clientRect = (ReactDOM.findDOMNode(
      this.props.layout
    ) as Element).getBoundingClientRect();
    const r = (this.selfRef as Element).getBoundingClientRect();
    this.props.node._setTabRect(
      new Rect(
        r.left - clientRect.left,
        r.top - clientRect.top,
        r.width,
        r.height
      )
    );
    this.contentWidth = (this
      .contentRef as Element).getBoundingClientRect().width;
  }

  onTextBoxMouseDown = (
    event:
      | React.MouseEvent<HTMLInputElement>
      | React.TouchEvent<HTMLInputElement>
  ) => {
    // console.log("onTextBoxMouseDown");
    event.stopPropagation();
  }

  onTextBoxKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // console.log(event, event.keyCode);
    if (event.keyCode === 27) {
      // esc
      this.setState({ editing: false });
    } else if (event.keyCode === 13) {
      // enter
      this.setState({ editing: false });
      const node = this.props.node;
      this.props.layout.doAction(
        Actions.renameTab(
          node.getId(),
          (event.target as HTMLInputElement).value
        )
      );
    }
  }

  doRename(node: TabNode, newName: string) {
    this.props.layout.doAction(Actions.renameTab(node.getId(), newName));
  }

  render() {
    const cm = this.props.layout.getClassName;

    let classNames = cm("flexlayout__tab_button", this.props.node);
    const node = this.props.node;

    if (this.props.selected) {
      classNames +=
        " " + cm("flexlayout__tab_button--selected", this.props.node);
    } else {
      classNames +=
        " " + cm("flexlayout__tab_button--unselected", this.props.node);
    }

    if (this.props.node.getClassName() !== undefined) {
      classNames += " " + this.props.node.getClassName();
    }

    let leadingContent;

    if (node.getIcon() !== undefined) {
      leadingContent = <img src={node.getIcon()} alt="leadingContent" />;
    }

    // allow customization of leading contents (icon) and contents
    const renderState = { leading: leadingContent, content: node.getName() };
    this.props.layout.customizeTab(node, renderState);

    return (
      <div
        ref={ref => (this.selfRef = ref === null ? undefined : ref)}
        style={{
          visibility: this.props.show ? "visible" : "hidden",
          height: this.props.height
        }}
        className={classNames}
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onMouseDown}
      >
        <Leading cm={cm} node={this.props.node} renderState={renderState} />
        <Content
          editing={this.state.editing}
          cm={cm}
          onTextBoxKeyPress={this.onTextBoxKeyPress}
          onTextBoxMouseDown={this.onTextBoxMouseDown}
          renderState={renderState}
          node={this.props.node}
        />
        <CloseButton
          isEnableClose={this.props.node.isEnableClose()}
          cm={cm}
          node={this.props.node}
          onClose={this.onClose}
          onCloseMouseDown={this.onCloseMouseDown}
        />
      </div>
    );
  }
}

// tslint:disable-next-line: variable-name
const Leading = (props: {
  cm: any;
  node: any;
  renderState: {
    leading: JSX.Element | undefined;
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
      leading: JSX.Element | undefined;
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
    renderState
  } = props;

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
          {renderState.content}
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
