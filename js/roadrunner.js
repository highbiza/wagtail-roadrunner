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
import "./roadrunner.scss"

window.telepath.register('roadrunner.fields.RoadrunnerRowBlockDefinition', RoadrunnerRowBlockDefinition)
window.telepath.register('roadrunner.fields.StylingBlockDefinition', StylingBlockDefinition)
window.telepath.register('roadrunner.fields.PreviewStreamBlockDefinition', PreviewStreamBlockDefinition)
window.telepath.register('roadrunner.fields.PreviewFieldBlockDefinition', PreviewFieldBlockDefinition)
window.telepath.register('roadrunner.fields.RoadRunnerBaseBlockDefinition', RoadRunnerBaseBlockDefinition)
window.telepath.register('roadrunner.fields.ImageChooserBlockDefinition', ImageChooserBlockDefinition)
window.telepath.register('roadrunner.fields.RichTextBlockDefinition', RichTextBlockDefinition)
window.telepath.register('roadrunner.fields.GridChoiceBlockDefinition', GridChoiceBlockDefinition)

$(() => {
  $("#roadrunner-breakpoint-switcher button").each((_, button) => {
    const btn = $(button)
    const value = btn.val()
    btn.click(evt => {
      breakPointEmitter.dispatch(value)
    })
  })
})


