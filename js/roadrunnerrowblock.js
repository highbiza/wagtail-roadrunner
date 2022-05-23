import dom, { Fragment, portalCreator } from 'jsx-render'
import $ from "jquery"
import { renderInPlaceHolder, PlaceHolder } from "./jsx"
import { wagtailGridSizeFromBootstrapGridSize } from "./utils"
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
          class="c-sf-block__actions__single c-sf-add-button--visible">
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

  _createChild(blockDef, placeholder, prefix, index, id, initialState, sequence, opts) {
    console.log(initialState)
    const { grid: gridSize=["col12"] } = initialState;
    const wagtailGridSize = wagtailGridSizeFromBootstrapGridSize(gridSize)
    console.log("wagtailGridSize", wagtailGridSize)
    const result = renderInPlaceHolder(placeholder, (
      <div className={`column ${wagtailGridSize}`} data-gridsize={gridSize} >
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
    console.log("RoadrunnerRowBlockDefinition", meta)
    super(name, childBlockDef, initialChildState, meta)
  }

  render(placeholder, prefix, initialState, initialError) {
    return new RoadrunnerRowBlock(this, placeholder, prefix, initialState, initialError);
  }
}

