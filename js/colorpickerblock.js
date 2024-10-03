import dom from 'jsx-render'
import $ from "jquery"
import { renderInPlaceHolder, PlaceHolder } from "./jsx"
import { MiniColorPicker } from '@easylogic/colorpicker'
import '@easylogic/colorpicker/dist/colorpicker.css'
import "./colorpickerblock.scss"

export class ColorPickerBlock extends window.wagtailStreamField.blocks.FieldBlock {
  constructor(blockDef, placeholder, prefix, initialState, initialError) {
    const { element, placeholders } = renderInPlaceHolder(placeholder, (
      <section className="colorpicker-wrapper">
        <PlaceHolder/>
        <div class="color-picker">
          <PlaceHolder/>
        </div>
      </section>
    ))

    const [blockPlaceholder, pickerPlaceholder] = placeholders
    super(blockDef, blockPlaceholder, prefix, initialState, initialError)

    element.style.setProperty('--picker-color', initialState || "#C3C3C3")
    const pickerWrapper = $(element).find(".color-picker")

    $(element).find(".w-field__input > input")
      .after("<span></span>")

    $(element).find(".w-field__input > span")
      .click(() => {
        $(pickerWrapper).toggleClass("active")
      })

    const { widget: { input } } = this

    $(input).on("input", () => {
      element.style.setProperty('--picker-color', $(input).val())
    })

    this.colorpicker = new MiniColorPicker({
      color: initialState,
      position: "inline",
      container: pickerPlaceholder,
      onChange(color) {
        $(input).val(color)
        element.style.setProperty('--picker-color', color)
      },
    })
  }
}

export class ColorPickerBlockDefinition extends window.wagtailStreamField.blocks.FieldBlockDefinition {
  render(placeholder, prefix, initialState, initialError) {
    return new ColorPickerBlock(this, placeholder, prefix, initialState, initialError)
  }
}
