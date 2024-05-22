import $ from "jquery"
import { breakPointEmitter } from "./events"
import { RoadrunnerRowBlockDefinition } from "./roadrunnerrowblock"
import { StylingBlockDefinition } from "./stylingblock"
import { RoadRunnerBaseBlockDefinition } from "./roadrunnerbaseblock"
import { ImageChooserBlockDefinition } from "./preview/imagechooserblock"
import { PreviewStreamBlockDefinition } from "./preview/streamblock"
import { PreviewFieldBlockDefinition } from "./preview/fieldblock"
import { RichTextBlockDefinition } from "./preview/richtextblock"
import { GridChoiceBlockDefinition } from "./gridchoiceblock"
import { ColorPickerBlockDefinition } from "./colorpickerblock"
import { PreviewListBlockDefinition } from "./preview/listblock"
import { PageTitleDefinition } from "./preview/pagetitle"

import "bootstrap/js/src/tab"
import "bootstrap/js/src/collapse"
import "./bootstrapnoconflict/bootstrap.scss"
import "./roadrunner.scss"

window.telepath.register('roadrunner.fields.RoadrunnerRowBlockDefinition', RoadrunnerRowBlockDefinition)
window.telepath.register('roadrunner.fields.StylingBlockDefinition', StylingBlockDefinition)
window.telepath.register('roadrunner.fields.PreviewStreamBlockDefinition', PreviewStreamBlockDefinition)
window.telepath.register('roadrunner.fields.PreviewFieldBlockDefinition', PreviewFieldBlockDefinition)
window.telepath.register('roadrunner.fields.RoadRunnerBaseBlockDefinition', RoadRunnerBaseBlockDefinition)
window.telepath.register('roadrunner.fields.ImageChooserBlockDefinition', ImageChooserBlockDefinition)
window.telepath.register('roadrunner.fields.RichTextBlockDefinition', RichTextBlockDefinition)
window.telepath.register('roadrunner.fields.GridChoiceBlockDefinition', GridChoiceBlockDefinition)
window.telepath.register('roadrunner.fields.ColorPickerBlockDefinition', ColorPickerBlockDefinition)
window.telepath.register('roadrunner.fields.PreviewListBlockDefinition', PreviewListBlockDefinition)
window.telepath.register("roadrunner.fields.PageTitleDefinition", PageTitleDefinition)

$(() => {
  $("[data-device-width]").change(event => {
    breakPointEmitter.translateDispatch(event.target.value)
  })

  try {
    const storedPreviewPanelDevice = localStorage.getItem('wagtail:preview-panel-device')
    breakPointEmitter.translateDispatch(storedPreviewPanelDevice)
  } catch (e) {
    // no need to change the default device width when nothing is stored.
  }
})

export * as roadrunner from "./roadrunner"
