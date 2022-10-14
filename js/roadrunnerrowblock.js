import dom, { Fragment } from 'jsx-render'
import $ from "jquery"
import { renderInPlaceHolder, PlaceHolder } from "./jsx"
import { wagtailGridSizeFromBootstrapGridSize } from "./utils"
import { GRID_SIZE_CHANGED_EVENT, breakPointEmitter } from "./events"
import "./roadrunnerrowblock.scss"


export class RoadrunnerRowBlockInsertionControl {
  constructor(placeholder, opts) {
    this.opts = opts
    this.index = opts && opts.index
    this.onRequestInsert = opts && opts.onRequestInsert
    this.hidden = true
    this.renderHidden(placeholder)
  }

  renderHidden(placeholder) {
    const { element } = renderInPlaceHolder(placeholder,
      <div data-streamfield-list-add className="d-none u-hidden col"/>
    )
    this.element = element
    this.hidden = true
  }

  renderVisible(placeholder) {
    const { element } = renderInPlaceHolder(placeholder, (
      <button type="button" title={this.opts.strings.ADD} data-streamfield-list-add
        className="c-sf-add-button c-sf-add-button--visible">
        <i aria-hidden="true">+</i>
      </button>
    ))
    $(element).click(() => {
      if (this.onRequestInsert) {
        this.onRequestInsert(this.index)
      }
    })
    this.element = element
    this.hidden = false
  }

  setIndex(newIndex) {
    this.index = newIndex
  }

  delete({ animate = false }) {
    if (animate) {
      $(this.element).slideUp()
        .attr('aria-hidden', 'true')
    } else {
      $(this.element).hide()
        .attr('aria-hidden', 'true')
    }
  }

  show() {
    if (this.hidden) {
      this.renderVisible(this.element)
    }
  }

  hide() {
    if (!this.hidden) {
      $(this.element).off()
      this.renderHidden(this.element)
    }
  }

  enable() {
    if (!this.hidden) {
      $(this.element).removeAttr('disabled')
    }
  }

  disable() {
    if (!this.hidden) {
      $(this.element).attr('disabled', 'true')
    }
  }
}

export class InsertButton {
  constructor(sequenceChild) {
    this.sequenceChild = sequenceChild
    this.onClick = this.onClick.bind(this)
  }

  onClick(evt) {
    this.sequenceChild.sequence._onRequestInsert(this.sequenceChild.index + 1)
    return false
  }

  render(container) {
    this.dom = $((
      <button type="button" title={this.sequenceChild.strings.ADD} data-streamfield-list-add
        class="c-sf-block__actions__single c-sf-add-button--visible add-action-insertbutton">
        +
      </button>
    ))

    this.dom.on('click', this.onClick)
    $(container).append(this.dom)
  }
}

export const ContainerSwapUI = ({prefix, originalWidth, strings}) => {
  let description = strings.SWAP_TO_FULL_WIDTH
  if (originalWidth == "full_width") {
    description = strings.SWAP_TO_BOXED
  }

  return (
    <div class="modal preview" id={`swap-${prefix}`} tabindex="-1" role="dialog">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-header d-flex align-items-center">
            <h3 class="modal-title my-0">{strings.SWAP_TITLE}</h3>
            <button type="button" class="btn btn-secondary ms-auto py-1" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>{ description }</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary swap">{ strings.OK }</button>
            <button type="button" class="btn btn-secondary ms-2" data-dismiss="modal">{ strings.CANCEL }</button>
          </div>
        </div>
      </div>
    </div>
  )
}


export class ContainerSwapWidget {
  constructor(blockDef, prefix) {
    // cut off '-value-row'
    let containerPrefix = prefix.slice(0, -10)
    const containerTypeInput = $(`input[name=${containerPrefix}-type]`)
    const containerContentPath = $(`input[name=${containerPrefix}-id]`).val()
    if (containerContentPath) {
      // when a rowblock is being duplicated it doesn't have an id yet.
      this.hasContentPath = true
      const containerTitle = $(`[data-contentpath=${containerContentPath}] .c-sf-block__actions > .c-sf-block__type`).first()
      const originalWidth = containerTypeInput.val()
      this.blockDef = blockDef
      this.prefix = prefix
      this.containerTypeInput = containerTypeInput
      this.containerTitle = containerTitle
      this.originalWidth = originalWidth
      this.element = null
      this.placeholder = null

      this.handleTitleClicked = this.handleTitleClicked.bind(this)
      this.handleAcceptSwap =  this.handleAcceptSwap.bind(this)

      containerTitle.click(this.handleTitleClicked)
    } else {
      this.hasContentPath = false
    }
  }

  handleAcceptSwap(evt) {
    if (this.originalWidth == "full_width") {
      this.containerTypeInput.val("fixed_width")
      this.originalWidth = "fixed_width"
      this.containerTitle.text("Fixed width")
    } else {
      this.containerTypeInput.val("full_width")
      this.originalWidth = "full_width"
      this.containerTitle.text("Full width")
    }
    const [node] = this.swapModal
    $(this.swapModal).modal('hide')
    this.renderInPlaceHolder(node)
  }

  handleTitleClicked(evt) {
    evt.stopPropagation()
    evt.preventDefault()
    $(this.swapModal).modal('show')
  }

  renderInPlaceHolder(originalPlaceholder) {
    if (this.hasContentPath) {
      const { element, placeholder} = renderInPlaceHolder(originalPlaceholder, (
        <Fragment>
          <ContainerSwapUI prefix={this.prefix} originalWidth={this.originalWidth} strings={this.blockDef.meta.strings} />
          <PlaceHolder/>
        </Fragment>
      ))
      this.swapModal = $(element).find(`#swap-${this.prefix}`)
      // some really dynamic widgets need to measure the comtainer size, but because
      // the modal is drawn hidden initially we need to fake a resize event so it will
      // measure when show at the right size.
      $(element).one('shown.bs.modal', e => {
        $(window).trigger("resize")
      })

      $(this.swapModal).find(".btn-primary.swap")
        .click(this.handleAcceptSwap)

      this.element = element
      this.placeholder = placeholder
      return { element, placeholder }
    }
    // skip rendering the swap interface if no contentPath can be determined
    return { placeholder: originalPlaceholder }
  }
}


export class RoadrunnerRowBlock extends window.wagtailStreamField.blocks.ListBlock {

  constructor(blockDef, originalPlaceholder, prefix, initialState, initialError) {
    const containerSwap = new ContainerSwapWidget(blockDef, prefix)
    const { placeholder } = containerSwap.renderInPlaceHolder(originalPlaceholder)

    super(blockDef, placeholder, prefix, initialState, initialError)

    $(this.sequenceContainer).addClass("roadrunner row")
    this._createChild = this._createChild.bind(this)
    this.containerSwap = containerSwap
  }

  _onRequestInsert(index, opts) {
    const [blockDef, initialState, id] = this._getChildDataForInsertion(opts)

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

    const newChild = this._insert(blockDef, initialState, id || null, index, { animate: true })
    // focus the newly added field if we can do so without obtrusive UI behaviour
    newChild.focus({ soft: true })
  }

  _createChild(blockDef, placeholder, prefix, index, id, initialState, sequence, opts) {
    const { grid: gridSize=["col12"] } = initialState
    const wagtailGridSize = wagtailGridSizeFromBootstrapGridSize(gridSize)

    const result = renderInPlaceHolder(placeholder, (
      <div className={`column ${wagtailGridSize}`} data-gridsize={gridSize}>
        <PlaceHolder />
      </div>
    ))

    const columnElement = result.element
    const child = super._createChild(blockDef, result.placeholder, prefix, index, id, initialState, sequence, opts)

    // add event listeners
    columnElement.addEventListener(GRID_SIZE_CHANGED_EVENT, e => {
      columnElement.className = `column col${e.detail.size}`
    })
    breakPointEmitter.addListener(newBreakpoint => {
      const { value: { grid }} = child.getState()
      const size = wagtailGridSizeFromBootstrapGridSize(grid, newBreakpoint)
      if (size) {
        columnElement.className = `column ${size}`
      }
    })

    child.element = columnElement
    child.addActionButton(new InsertButton(child))
    return child
  }

  _createInsertionControl(placeholder, opts) {
    return new RoadrunnerRowBlockInsertionControl(placeholder, opts)
  }

  blockCountChanged() {
    super.blockCountChanged()

    // when there are no children, InsertionControl must be shown, otherwise
    // keep them hidden
    if (this.children.length) {
      this.inserters.forEach(inserter => inserter.hide())
    } else {
      this.inserters.forEach(inserter => inserter.show())
    }
  }
}


export class RoadrunnerRowBlockDefinition extends window.wagtailStreamField.blocks.ListBlockDefinition {
  constructor(name, childBlockDef, initialChildState, meta) {
    meta.label = ""
    super(name, childBlockDef, initialChildState, meta)
  }
  render(placeholder, prefix, initialState, initialError) {
    return new RoadrunnerRowBlock(this, placeholder, prefix, initialState, initialError)
  }
}

