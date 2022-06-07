import dom, { Fragment, portalCreator } from 'jsx-render'
import $ from "jquery"
import { renderInPlaceHolder, PlaceHolder } from "./jsx"
import { wagtailGridSizeFromBootstrapGridSize } from "./utils"
import { GRID_SIZE_CHANGED_EVENT } from "./events"
import "./roadrunnerrowblock.scss"


class RoadrunnerRowBlockInsertionControl {
  constructor(placeholder, opts) {
    this.index = opts && opts.index;
    this.onRequestInsert = opts && opts.onRequestInsert;
    const button = $(`<div data-streamfield-list-add class="d-none u-hidden col"/>`);
    $(placeholder).replaceWith(button);
    this.element = button.get(0);
  }

  setIndex(newIndex) {
    this.index = newIndex;
  }

  delete({ animate = false }) {
    if (animate) {
      $(this.element).slideUp().attr('aria-hidden', 'true');
    } else {
      $(this.element).hide().attr('aria-hidden', 'true');
    }
  }
}

class InsertButton {
  constructor(sequenceChild) {
    this.sequenceChild = sequenceChild;
    this.onClick = this.onClick.bind(this);
  }

  onClick(evt) {
    this.sequenceChild.sequence._onRequestInsert(this.sequenceChild.index + 1)
    return false
  }

  render(container) {
    // const label = this.sequenceChild.strings[this.labelIdentifier] || this.labelIdentifier;
    this.dom = $((
      <button type="button" title={this.sequenceChild.strings['ADD']} data-streamfield-list-add
          class="c-sf-block__actions__single c-sf-add-button--visible add-action-insertbutton">
        +
      </button>
    ));
    
    this.dom.on('click', this.onClick);
    $(container).append(this.dom);
  }
}


class RoadrunnerRowBlock extends window.wagtailStreamField.blocks.ListBlock {
  constructor(blockDef, placeholder, prefix, initialState, initialError) {
    super(blockDef, placeholder, prefix, initialState, initialError);
    $(this.sequenceContainer).addClass("roadrunner row");
    this._createChild = this._createChild.bind(this);
  }

  _onRequestInsert(index, opts) {
    const [blockDef, initialState, id] = this._getChildDataForInsertion(opts);
    /* handler for an 'insert new block' action */
    try {
      const nextChild = this.children[index]
      if (nextChild) {
        const { value: { grid }} = nextChild.getState()
        initialState.grid = grid
      }
    } catch (e) {
      console.log("TODO: see if this ever happens", e)
    }

    const newChild = this._insert(blockDef, initialState, id || null, index, { animate: true });
    // focus the newly added field if we can do so without obtrusive UI behaviour
    newChild.focus({ soft: true });
  }

  _createChild(blockDef, placeholder, prefix, index, id, initialState, sequence, opts) {
    const { grid: gridSize=["col12"] } = initialState;
    const wagtailGridSize = wagtailGridSizeFromBootstrapGridSize(gridSize)
    console.log("wagtailGridSize", wagtailGridSize)

    const registerGridSizeChanged = (element, attrs) => {
      element.addEventListener(GRID_SIZE_CHANGED_EVENT, e => {
        element.className = `column col${e.detail.size}`
      })
    }

    const result = renderInPlaceHolder(placeholder, (
      <div className={`column ${wagtailGridSize}`} data-gridsize={gridSize} ref={registerGridSizeChanged}>
        <PlaceHolder />
      </div>
    ))

    const child = super._createChild(blockDef, result.placeholder, prefix, index, id, initialState, sequence, opts)
    child.element = result.element;
    child.addActionButton(new InsertButton(child))
    return child
  }

  _createInsertionControl(placeholder, opts) {
    return new RoadrunnerRowBlockInsertionControl(placeholder, opts);
  }
}


export class RoadrunnerRowBlockDefinition extends window.wagtailStreamField.blocks.ListBlockDefinition {
  constructor(name, childBlockDef, initialChildState, meta) {
    // console.log("RoadrunnerRowBlockDefinition", meta)
    super(name, childBlockDef, initialChildState, meta)
  }

  render(placeholder, prefix, initialState, initialError) {
    return new RoadrunnerRowBlock(this, placeholder, prefix, initialState, initialError);
  }
}

